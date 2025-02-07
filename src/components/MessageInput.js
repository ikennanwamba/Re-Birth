import React, { useState } from 'react';
import styled from '@emotion/styled';

const InputContainer = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-top: 1px solid #eee;

  @media (max-width: 768px) {
    padding: 0.5rem;
    gap: 0.5rem;
    position: sticky;
    bottom: 0;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 0.8rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;

  @media (max-width: 768px) {
    padding: 0.6rem;
    font-size: 0.9rem;
  }
`;

const SendButton = styled.button`
  padding: 0.8rem 1.5rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
  }
`;

function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      setIsLoading(true);
      await onSendMessage(message);
      setMessage('');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputContainer>
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <SendButton type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </SendButton>
      </InputContainer>
    </form>
  );
}

export default MessageInput; 