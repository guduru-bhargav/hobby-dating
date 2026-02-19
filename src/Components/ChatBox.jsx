import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import "./ChatBox.css";

function ChatBox({ profile, onClose }) {
  const [authUser, setAuthUser] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ Get logged-in user directly from Supabase
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        console.warn("⚠ No authenticated user");
        return;
      }

      console.log("✅ Auth user:", data.user.id);
      setAuthUser(data.user);
    };

    getUser();
  }, []);

  // 1️⃣ Fetch / Create Conversation
  useEffect(() => {
    if (!authUser?.id || !profile?.id) return;

    const initChat = async () => {
      console.log("🚀 InitChat running");

      const userA = authUser.id;
      const userB = profile.user_id;

      console.log("UserA:", userA);
      console.log("UserB:", userB);

      // 🔍 Check if conversation already exists
      const { data: existing, error } = await supabase
        .from("conversations")
        .select("*")
        .or(
          `and(user1.eq.${userA},user2.eq.${userB}),and(user1.eq.${userB},user2.eq.${userA})`
        )
        .maybeSingle();

      if (error) {
        console.error("❌ Fetch conversation error:", error);
        return;
      }

      if (existing) {
        console.log("✅ Found existing conversation");
        setConversation(existing);
        return;
      }

      console.log("✨ Creating new conversation");

      const { data: newConv, error: insertError } = await supabase
        .from("conversations")
        .insert({
          user1: userA,
          user2: userB,
        })
        .select()
        .single();

      if (insertError) {
        console.error("❌ Conversation insert failed:", insertError);
      } else {
        console.log("✅ Conversation created:", newConv);
        setConversation(newConv);
      }
    };

    initChat();
  }, [authUser?.id, profile?.id]);

  // 2️⃣ Fetch Messages + Realtime
  useEffect(() => {
    if (!conversation?.id) return;

    let channel;

    const fetchMessages = async () => {
      console.log("📥 Fetching messages");

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversation.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("❌ Messages fetch error:", error);
      } else {
        setMessages(data || []);
      }
    };

    fetchMessages();

    channel = supabase
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
          console.log("⚡ Realtime message:", payload.new);

          setMessages((prev) => {
            if (prev.some((m) => m.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        }
      )
      .subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [conversation?.id]);

  // 3️⃣ Send Message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    if (!conversation?.id || !authUser?.id || sending) return;

    const tempId = Date.now();

    const optimisticMessage = {
      id: tempId,
      conversation_id: conversation.id,
      sender_id: authUser.id,
      message: newMessage,
      status: "sending",
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");
    setSending(true);

    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversation.id,
        sender_id: authUser.id,
        message: optimisticMessage.message,
      })
      .select()
      .single();

    if (error) {
      console.error("❌ Send error:", error);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, status: "failed" } : msg
        )
      );
    } else {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...data, status: "sent" } : msg
        )
      );
    }

    setSending(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };
useEffect(() => {
  if (!conversation?.id || !currentUser?.id) return;

  markAsRead();
}, [conversation?.id]);

const markAsRead = async () => {
  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("conversation_id", conversation.id)
    .eq("user_id", currentUser.id);
};

  return (
    <div className="chat-overlay" onClick={onClose}>
      <div className="chat-box" onClick={(e) => e.stopPropagation()}>
        <div className="chat-header">
          <img src={profile.photo_2} alt={profile.photo_1} />
          <h4>{profile.first_name}</h4>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="chat-messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message-wrapper ${
                msg.sender_id === authUser?.id ? "sent" : "received"
              }`}
            >
              <p className={`message ${msg.status || ""}`}>
                {msg.message}
              </p>

              {msg.status === "sending" && (
                <span className="message-status">Sending...</span>
              )}

              {msg.status === "failed" && (
                <span className="message-status failed">Failed</span>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sending}
          />
          <button onClick={sendMessage} disabled={sending}>
            {sending ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
