import './ChatBox.css'

function ChatBox({ profile, onClose }) {
  return (
    <div className="chat-overlay" onClick={onClose}>
      <div className="chat-box" onClick={(e) => e.stopPropagation()}>
        
        <div className="chat-header">
          <img src={profile.image} alt={profile.name} />
          <h4>{profile.name}</h4>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="chat-messages">
          <p className="message received">Hi 👋</p>
          <p className="message sent">Hey! How are you?</p>
        </div>

        <div className="chat-input">
          <input placeholder="Type a message..." />
          <button>Send</button>
        </div>

      </div>
    </div>
  );
}

export default ChatBox;
