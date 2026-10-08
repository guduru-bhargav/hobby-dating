import React, { useCallback, useEffect, useState } from "react";
import Icon from "./Icon";
import { fetchUnreadConversationIds, listConversations } from "../api/chat";
import { supabase } from "../lib/supabase";
import { errorMessage, photoOf, timeAgo } from "../lib/utils";
import "./ChatList.css";

// Inbox: every conversation the viewer is part of, newest first
function ChatList({ meId, selectedId, onSelect }) {
  const [chats, setChats] = useState([]);
  const [unreadIds, setUnreadIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [list, unread] = await Promise.all([
        listConversations(meId),
        fetchUnreadConversationIds(meId),
      ]);
      setChats(list);
      setUnreadIds(unread);
      setError("");
    } catch (err) {
      setError(errorMessage(err, "Couldn't load your messages."));
    } finally {
      setLoading(false);
    }
  }, [meId]);

  useEffect(() => {
    load();

    // Refresh the inbox whenever a conversation or one of this viewer's notifications changes
    // (RLS limits both to rows the viewer is actually part of)
    const channel = supabase
      .channel(`inbox_${meId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, load)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${meId}` },
        load
      )
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
        const unread = unreadIds.has(chat.id);
        return (
          <button
            key={chat.id}
            type="button"
            className={`inbox-item ${active ? "active" : ""} ${unread ? "unread" : ""}`}
            onClick={() => chat.profile && onSelect(chat.profile)}
            disabled={!chat.profile}
          >
            <span className="inbox-avatar-wrap">
              <img className="inbox-avatar" src={photoOf(chat.profile, 1)} alt="" />
              {unread && <span className="unread-dot" aria-hidden="true" />}
            </span>
            <span className="inbox-text">
              <strong className="inbox-name">{name}</strong>
              <span className="inbox-row">
                <span className="inbox-preview">
                  {chat.last_message || "Say hi 👋"}
                </span>
                <time>{timeAgo(chat.last_message_at || chat.created_at)}</time>
              </span>
            </span>
            {unread && <span className="sr-only">Unread</span>}
          </button>
        );
      })}
    </div>
  );
}

export default ChatList;
