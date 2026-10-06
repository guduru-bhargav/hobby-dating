import React, { useCallback, useEffect, useState } from "react";
import Icon from "./Icon";
import { listConversations } from "../api/chat";
import { supabase } from "../lib/supabase";
import { errorMessage, photoOf, timeAgo } from "../lib/utils";
import "./ChatList.css";

// Inbox: every conversation the viewer is part of, newest first
function ChatList({ meId, selectedId, onSelect }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setChats(await listConversations(meId));
      setError("");
    } catch (err) {
      setError(errorMessage(err, "Couldn't load your messages."));
    } finally {
      setLoading(false);
    }
  }, [meId]);

  useEffect(() => {
    load();

    // Refresh the inbox whenever any conversation changes (RLS limits rows to the viewer)
    const channel = supabase
      .channel(`inbox_${meId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, load)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [meId, load]);

  if (loading) return <div className="chatlist-state"><div className="spinner" /></div>;

  return (
    <div className="inbox">
      {error && <div className="form-error" role="alert">{error}</div>}

      {!error && chats.length === 0 && (
        <div className="inbox-empty">
          <div className="empty-icon"><Icon name="chat" size={26} /></div>
          <h3>No conversations yet</h3>
          <p>Message someone from Discover and it will show up here.</p>
        </div>
      )}

      {chats.map((chat) => {
        const name = chat.profile?.first_name || "Former member";
        const active = chat.profile && chat.profile.user_id === selectedId;
        return (
          <button
            key={chat.id}
            type="button"
            className={`inbox-item ${active ? "active" : ""}`}
            onClick={() => chat.profile && onSelect(chat.profile)}
            disabled={!chat.profile}
          >
            <img className="inbox-avatar" src={photoOf(chat.profile, 1)} alt="" />
            <span className="inbox-text">
              <span className="inbox-row">
                <strong>{name}</strong>
                <time>{timeAgo(chat.last_message_at || chat.created_at)}</time>
              </span>
              <span className="inbox-preview">
                {chat.last_message || "Say hi 👋"}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default ChatList;
