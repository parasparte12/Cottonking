import React, { useState, useRef, useEffect } from 'react';
import './AIAssistant.css';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: '👋 Hi! I am your CottonKing AI assistant. How can I help you today?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: 'user',
      text: inputMessage
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentMessage }),
      });

      const data = await response.json();

      const botMessage = {
        type: 'bot',
        text: data.response || 'Sorry, I encountered an error. Please try again.'
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        type: 'bot',
        text: 'Sorry, I could not connect to the server. Please make sure the backend is running on port 8080.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "What cotton shirts do you sell?",
    "Tell me about women's collection",
    "What are your prices?",
    "Any discounts available?"
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    setTimeout(() => {
      sendMessage();
    }, 100);
  };

  if (!isOpen) {
    return (
      <div className="ai-chat-button" onClick={toggleChat}>
        <div className="chat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <span className="ai-badge">AI</span>
      </div>
    );
  }

  return (
    <div className="ai-chat-container">
      <div className="ai-chat-header">
        <div className="header-content">
          <div className="bot-avatar">🤖</div>
          <div className="header-info">
            <h3>CottonKing AI</h3>
            <span className="status-online">● Online</span>
          </div>
        </div>
        <button className="close-btn" onClick={toggleChat}>×</button>
      </div>

      <div className="ai-chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.type}`}>
            {msg.type === 'bot' && <div className="msg-avatar">🤖</div>}
            <div className="msg-bubble">
              {msg.text.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < msg.text.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="chat-message bot">
            <div className="msg-avatar">🤖</div>
            <div className="msg-bubble typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 1 && (
        <div className="quick-suggestions">
          <p className="suggestions-title">Quick questions:</p>
          <div className="suggestions-grid">
            {quickQuestions.map((q, i) => (
              <button key={i} onClick={() => handleQuickQuestion(q)} className="suggestion-btn">
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="ai-chat-input">
        <input
          type="text"
          className="chat-text-input"
          placeholder="Ask me anything..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button 
          className="send-btn" 
          onClick={sendMessage} 
          disabled={isLoading || !inputMessage.trim()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;

