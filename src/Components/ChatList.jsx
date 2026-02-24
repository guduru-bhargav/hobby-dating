import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./ChatList.css";

function ChatList({ currentUser, setSelectedProfile }) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (currentUser?.id) fetchChats();
  }, [currentUser?.id]);

  const fetchChats = async () => {
    const { data: convos, error } = await supabase
      .from("conversations")
      .select("*")
      .or(`user1.eq.${currentUser.id},user2.eq.${currentUser.id}`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Conversations error:", error);
      return;
    }

    if (!convos?.length) {
      setChats([]);
      return;
    }

    const otherUserIds = convos.map((conv) =>
      conv.user1 === currentUser.id ? conv.user2 : conv.user1
    );

    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .in("user_id", otherUserIds);

    const merged = convos.map((conv) => {
      const otherUserId =
        conv.user1 === currentUser.id ? conv.user2 : conv.user1;

      const profile = profiles?.find(
        (p) => p.user_id === otherUserId
      );

      return { ...conv, profile };
    });

    console.log("✅ Chats merged:", merged);
    setChats(merged);
  };

  return (
    <div className="chatlist-container">
      <h2 className="chatlist-title">Messages</h2>

      {chats.length === 0 && (
        <p className="no-chats">No chats yet</p>
      )}

      {chats.map((chat) => (
        <div
          key={chat.id}
          className="chat-item"
          onClick={() => {
            if (!chat.profile) return;
            console.log("🚀 Opening:", chat.profile);
            setSelectedProfile(chat.profile);
          }}
        >
          <img
            src={
              chat.profile?.photo_1 ||
              chat.profile?.photo_2 ||
              "https://i.pravatar.cc/150?img=1"
            }
            alt="avatar"
            className="chat-avatar"
          />

          <div className="chat-info">
            <h4>{chat.profile?.first_name || "Unknown"}</h4>
            <p>
              {chat.last_message_text || "Let's start chatting 💬"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatList;