import React from "react";
import "./ChatList.css";

function ChatList({ currentUser }) {
  return (
    <div className="chatlist-container">
      <h2>Chats</h2>

      <div className="chat-placeholder">
        <p>No conversations yet</p>
        <span>Start chatting by liking profiles ❤️</span>
      </div>
    </div>
  );
}

export default ChatList;