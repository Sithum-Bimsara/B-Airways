'use client';

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Welcome to B Airways! I\'m your virtual assistant. How can I help you with your travel plans today?' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    // Add user message to chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', text: newMessage },
    ]);

    const userMessage = newMessage;
    setNewMessage('');

    try {
      // Send message to backend
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // Add bot response to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: data.response },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: 'bot',
          text: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
        },
      ]);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <StyledWrapper onClick={handleBackdropClick}>
      <div className="card-container">
        <div className="card-header">
          <div className="img-avatar" />
          <div className="text-chat">B Airways Assistant</div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="card-body">
          <div className="messages-container">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message-box ${
                  msg.sender === 'bot' ? 'left' : 'right'
                }`}
              >
                {msg.sender === 'bot' ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                ) : (
                  <p>{msg.text}</p>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="message-input">
            <form onSubmit={handleSendMessage}>
              <textarea
                placeholder="Ask about flights, bookings, or travel information..."
                className="message-send"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className="button-send">
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  .card-container {
    background-color: #fff;
    border-radius: 20px;
    padding: 25px;
    width: 90%;
    max-width: 800px;
    height: 80vh;
    max-height: 800px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    animation: slideIn 0.4s ease-out;
  }

  @keyframes slideIn {
    from {
      transform: translateY(-30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .card-header {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #e8e8e8;
    position: relative;
  }

  .img-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #0070f3, #00a1ff);
    margin-right: 15px;
    position: relative;
    &:after {
      content: '';
      position: absolute;
      width: 12px;
      height: 12px;
      background-color: #22c55e;
      border-radius: 50%;
      bottom: 2px;
      right: 2px;
      border: 2px solid white;
    }
  }

  .text-chat {
    color: #1a1a1a;
    font-size: 26px;
    font-weight: bold;
  }

  .close-button {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    font-size: 32px;
    color: #666;
    cursor: pointer;
    padding: 0 10px;
    transition: all 0.2s ease;
  }

  .close-button:hover {
    color: #333;
    transform: translateY(-50%) scale(1.1);
  }

  .card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin-top: 20px;
  }

  .messages-container {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    background-color: #f8fafc;
    border-radius: 15px;
  }

  .message-box {
    padding: 14px 18px;
    margin-bottom: 14px;
    border-radius: 18px;
    max-width: 70%;
    word-wrap: break-word;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  }

  .message-box.left {
    background-color: #f0f0f0;
    align-self: flex-start;
    border-bottom-left-radius: 5px;
  }

  .message-box.right {
    background: linear-gradient(135deg, #0070f3, #00a1ff);
    color: #fff;
    align-self: flex-end;
    border-bottom-right-radius: 5px;
  }

  .message-box p {
    margin: 0;
  }

  .message-box ul {
    margin: 0;
    padding-left: 20px;
  }

  .message-box strong {
    font-weight: 600;
  }

  .message-input {
    padding: 20px;
    border-top: 2px solid #e8e8e8;
    background-color: #fff;
    border-radius: 0 0 20px 20px;
  }

  .message-input form {
    display: flex;
    gap: 15px;
  }

  .message-send {
    flex: 1;
    padding: 15px;
    border: 2px solid #e8e8e8;
    border-radius: 12px;
    resize: none;
    font-size: 16px;
    min-height: 50px;
    transition: border-color 0.2s ease;
    &:focus {
      outline: none;
      border-color: #0070f3;
    }
  }

  .button-send {
    padding: 12px 28px;
    background: linear-gradient(135deg, #0070f3, #00a1ff);
    color: #fff;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 16px;
    font-weight: 600;
    box-shadow: 0 4px 15px rgba(0,112,243,0.2);
  }

  .button-send:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,112,243,0.3);
  }

  @media (max-width: 768px) {
    .card-container {
      width: 95%;
      height: 90vh;
      margin: 15px;
    }

    .message-box {
      max-width: 85%;
    }
  }
`;

export default Chatbot;