import React, { useCallback, useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import {
  fetchMessages,
  getOrCreateConversation,
  markNotificationsRead,
  sendMessage,
} from "../api/chat";
import { supabase } from "../lib/supabase";
import { clockTime, errorMessage, photoOf } from "../lib/utils";
import "./ChatBox.css";

// One-to-one chat with `profile` (the other person). `meId` is the viewer's auth id.
function ChatBox({ meId, profile, onBack }) {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const listRef = useRef(null);

  // Open (or create) the conversation for this pair and load its history
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    setConversation(null);
    setMessages([]);

    (async () => {
      try {
        const conv = await getOrCreateConversation(meId, profile.user_id);
        if (cancelled) return;
        const history = await fetchMessages(conv.id);
        if (cancelled) return;
        setConversation(conv);
        setMessages(history);
        markNotificationsRead(meId, conv.id);
      } catch (err) {
        if (!cancelled) setError(errorMessage(err, "Couldn't open this chat."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [meId, profile.user_id]);

  // Live incoming messages for this conversation
  useEffect(() => {
    if (!conversation?.id) return;

    const channel = supabase
      .channel(`chat_${conversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversation.id}`,
        },
        (payload) => {
          const incoming = payload.new;
          setMessages((prev) => (prev.some((m) => m.id === incoming.id) ? prev : [...prev, incoming]));
          if (incoming.sender_id !== meId) markNotificationsRead(meId, conversation.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation?.id, meId]);

  // Keep the latest message in view
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const dispatch = useCallback(
    async (text, tempId) => {
      try {
        const saved = await sendMessage(conversation.id, meId, text);
        setMessages((prev) => {
          // Realtime may already have delivered the saved row; never show it twice
          const withoutTemp = prev.filter((m) => m.id !== tempId);
          return withoutTemp.some((m) => m.id === saved.id) ? withoutTemp : [...withoutTemp, saved];
        });
      } catch {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, status: "failed" } : m))
        );
      }
    },
    [conversation?.id, meId]
  );

  const handleSend = (e) => {
    e?.preventDefault();
    const text = draft.trim();
    if (!text || !conversation) return;

    const tempId = `tmp-${Date.now()}`;
    setDraft("");
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        conversation_id: conversation.id,
        sender_id: meId,
        message: text,
        created_at: new Date().toISOString(),
        status: "sending",
      },
    ]);
    dispatch(text, tempId);
  };

  const retry = (msg) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, status: "sending" } : m))
    );
    dispatch(msg.message, msg.id);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const name = profile.first_name || "Member";

  return (
    <section className="chat-panel" aria-label={`Chat with ${name}`}>
      <header className="chat-head">
        {onBack && (
          <button type="button" className="icon-btn chat-back" onClick={onBack} aria-label="Back to messages">
            <Icon name="back" size={20} />
          </button>
        )}
        <img className="chat-avatar" src={photoOf(profile, 1)} alt="" />
        <div className="chat-head-text">
          <h3>{name}</h3>
          {profile.location_city && <p>{profile.location_city}</p>}
        </div>
      </header>

      <div className="chat-messages" ref={listRef}>
        {loading && <div className="chat-state"><div className="spinner" /></div>}
        {error && <div className="form-error chat-state" role="alert">{error}</div>}

        {!loading && !error && messages.length === 0 && (
          <div className="chat-state chat-intro">
            <img className="chat-avatar lg" src={photoOf(profile, 1)} alt="" />
            <p>You matched on shared interests. Say hi to {name}.</p>
          </div>
        )}

        {messages.map((msg) => {
          const mine = msg.sender_id === meId;
          return (
            <div key={msg.id} className={`bubble-row ${mine ? "mine" : "theirs"}`}>
              <div className={`bubble ${msg.status === "failed" ? "failed" : ""}`}>
                <p>{msg.message}</p>
                <span className="bubble-meta">
                  {msg.status === "sending" && "Sending…"}
                  {msg.status === "failed" && (
                    <button type="button" className="retry" onClick={() => retry(msg)}>
                      Not sent · Retry
                    </button>
                  )}
                  {!msg.status && clockTime(msg.created_at)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <form className="chat-compose" onSubmit={handleSend}>
        <textarea
          className="input"
          rows={1}
          placeholder={conversation ? "Write a message…" : "Opening chat…"}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={!conversation}
          aria-label="Message"
        />
        <button type="submit" className="btn btn-primary send-btn"
          disabled={!conversation || !draft.trim()} aria-label="Send message">
          <Icon name="send" size={18} />
        </button>
      </form>
    </section>
  );
}

export default ChatBox;
