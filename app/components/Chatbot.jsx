'use client';

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I assist you today?' },
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
          text: 'Sorry, something went wrong. Please try again later.',
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
          <div className="text-chat">Chat</div>
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
                <p>{msg.text}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="message-input">
            <form onSubmit={handleSendMessage}>
              <textarea
                placeholder="Type your message here..."
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  .card-container {
    background-color: #fff;
    border-radius: 15px;
    padding: 20px;
    width: 90%;
    max-width: 800px;
    height: 80vh;
    max-height: 800px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      transform: translateY(-20px);
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
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
    position: relative;
  }

  .img-avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background-color: #0070f3;
    margin-right: 15px;
  }

  .text-chat {
    color: #333;
    font-size: 24px;
    font-weight: bold;
  }

  .close-button {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    font-size: 28px;
    color: #666;
    cursor: pointer;
    padding: 0 10px;
    transition: color 0.2s ease;
  }

  .close-button:hover {
    color: #333;
  }

  .card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin-top: 15px;
  }

  .messages-container {
    flex: 1;
    padding: 15px;
    overflow-y: auto;
    background-color: #f9f9f9;
    border-radius: 10px;
  }

  .message-box {
    padding: 12px 16px;
    margin-bottom: 12px;
    border-radius: 15px;
    max-width: 70%;
    word-wrap: break-word;
  }

  .message-box.left {
    background-color: #e1e1e1;
    align-self: flex-start;
  }

  .message-box.right {
    background-color: #0070f3;
    color: #fff;
    align-self: flex-end;
  }

  .message-input {
    padding: 15px;
    border-top: 1px solid #eee;
    background-color: #fff;
    border-radius: 0 0 15px 15px;
  }

  .message-input form {
    display: flex;
    gap: 10px;
  }

  .message-send {
    flex: 1;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    resize: none;
    font-size: 16px;
    min-height: 45px;
  }

  .button-send {
    padding: 12px 24px;
    background-color: #0070f3;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 16px;
    font-weight: 500;
  }

  .button-send:hover {
    background-color: #005bb5;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    .card-container {
      width: 95%;
      height: 90vh;
      margin: 20px;
    }

    .message-box {
      max-width: 85%;
    }
  }
`;

export default Chatbot;