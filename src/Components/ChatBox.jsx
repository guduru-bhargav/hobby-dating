import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import "./ChatBox.css";

function ChatBox({ profile, currentUser, onClose }) {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  console.log('currentUser,currentUser',currentUser);
  

  // Scroll to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  // 1️⃣ Fetch or create conversation
  useEffect(() => {
    const initChat = async () => {
      const { data: existing } = await supabase
        .from("conversations")
        .select("*")
        .or(
          `user1.eq.${currentUser.id},user1.eq.${profile.id},user2.eq.${currentUser.id},user2.eq.${profile.id}`
        )
        .maybeSingle();

      if (existing) setConversation(existing);
      else {
        const { data: newConv, error } = await supabase
          .from("conversations")
          .insert([{ user1: currentUser.id, user2: profile.id }])
          .single();
        if (error) console.error("Error creating conversation:", error);
        else setConversation(newConv);
      }
    };

    initChat();
  }, [currentUser, profile]);

  // 2️⃣ Fetch messages and subscribe
  useEffect(() => {
    if (!conversation) return;

    const fetchMessages = async () => {
      const { data: msgs, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversation.id)
        .order("created_at", { ascending: true });

      if (error) console.error("Error fetching messages:", error);
      else setMessages(msgs || []);
    };

    fetchMessages();

    // Real-time subscription
    const subscription = supabase
      .channel(`conversation_${conversation.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversation.id}` },
        (payload) => setMessages((prev) => [...prev, payload.new])
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [conversation]);

  // 3️⃣ Send message
  const sendMessage = async () => {
    if (!newMessage || !conversation) return;

    const { error } = await supabase.from("messages").insert([
      {
        conversation_id: conversation.id,
        sender_id: currentUser.id,
        message: newMessage,
      },
    ]);

    if (error) console.error("Error sending message:", error);
    else setNewMessage(""); // clear input
  };

  return (
    <div className="chat-overlay" onClick={onClose}>
      <div className="chat-box" onClick={(e) => e.stopPropagation()}>
        <div className="chat-header">
          <img src={profile.image} alt={profile.name} />
          <h4>{profile.name}</h4>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="chat-messages">
          {messages.map((msg) => (
            <p
              key={msg.id}
              className={`message ${
                msg.sender_id === currentUser.id ? "sent" : "received"
              }`}
            >
              {msg.message}
            </p>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
