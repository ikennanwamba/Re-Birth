import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';

const MessageContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Message = styled.div`
  padding: 0.8rem;
  border-radius: 8px;
  max-width: 80%;
  font-size: 1.1rem;
  line-height: 1.5;
  ${props => props.sender === 'user' ? `
    align-self: flex-end;
    background-color: #007bff;
    color: white;
  ` : `
    align-self: flex-start;
    background-color: #e9ecef;
    color: #212529;
  `}

  /* Make emojis slightly larger than text */
  span.emoji {
    font-size: 1.4rem;
    vertical-align: middle;
    margin: 0 0.1rem;
  }
`;

const MessageContent = styled.div`
  position: relative;
  overflow: hidden;
  max-height: ${props => props.expanded ? 'none' : '100px'};
  transition: max-height 0.3s ease-out;
`;

const ReadMoreButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.sender === 'user' ? 'rgba(255,255,255,0.8)' : '#007bff'};
  font-size: 0.9rem;
  padding: 4px 0;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 8px;
  
  &:hover {
    color: ${props => props.sender === 'user' ? 'white' : '#0056b3'};
  }
`;

// Helper function to wrap emojis in spans
const formatMessageWithEmojis = (content) => {
  // This regex matches emoji characters
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F1E6}-\u{1F1FF}]|[\u{1F191}-\u{1F251}]|[\u{1F004}]|[\u{1F0CF}]|[\u{1F170}-\u{1F171}]|[\u{1F17E}-\u{1F17F}]|[\u{1F18E}]|[\u{3030}]|[\u{2B50}]|[\u{2B55}]|[\u{2934}-\u{2935}]|[\u{2B05}-\u{2B07}]|[\u{2B1B}-\u{2B1C}]|[\u{3297}]|[\u{3299}]|[\u{1F201}]|[\u{1F202}]|[\u{1F21A}]|[\u{1F22F}]|[\u{1F232}-\u{1F23A}]|[\u{1F250}-\u{1F251}]|[\u{1F300}-\u{1F321}]|[\u{1F324}-\u{1F393}]|[\u{1F396}-\u{1F397}]|[\u{1F399}-\u{1F39B}]|[\u{1F39E}-\u{1F3F0}]|[\u{1F3F3}-\u{1F3F5}]|[\u{1F3F7}-\u{1F3FA}]|[\u{1F400}-\u{1F4FD}]|[\u{1F4FF}-\u{1F53D}]|[\u{1F549}-\u{1F54E}]|[\u{1F550}-\u{1F567}]|[\u{1F56F}-\u{1F570}]|[\u{1F573}-\u{1F57A}]|[\u{1F587}]|[\u{1F58A}-\u{1F58D}]|[\u{1F590}]|[\u{1F595}-\u{1F596}]|[\u{1F5A4}-\u{1F5A5}]|[\u{1F5A8}]|[\u{1F5B1}-\u{1F5B2}]|[\u{1F5BC}]|[\u{1F5C2}-\u{1F5C4}]|[\u{1F5D1}-\u{1F5D3}]|[\u{1F5DC}-\u{1F5DE}]|[\u{1F5E1}]|[\u{1F5E3}]|[\u{1F5E8}]|[\u{1F5EF}]|[\u{1F5F3}]|[\u{1F5FA}-\u{1F64F}]/gu;

  const parts = content.split(emojiRegex);
  const emojis = content.match(emojiRegex) || [];
  
  return parts.reduce((acc, part, i) => {
    acc.push(part);
    if (emojis[i]) {
      acc.push(<span key={i} className="emoji">{emojis[i]}</span>);
    }
    return acc;
  }, []);
};

const MessageWrapper = ({ content, sender }) => {
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    // Check if content height exceeds 100px
    if (contentRef.current) {
      setShowButton(contentRef.current.scrollHeight > 100);
    }
  }, [content]);

  return (
    <Message sender={sender}>
      <MessageContent ref={contentRef} expanded={expanded}>
        {formatMessageWithEmojis(content)}
      </MessageContent>
      {showButton && (
        <ReadMoreButton 
          sender={sender}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show less' : 'Read more...'}
        </ReadMoreButton>
      )}
    </Message>
  );
};

function MessageList({ messages }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <MessageContainer>
      {messages.map((message, index) => (
        <MessageWrapper
          key={index}
          content={message.content}
          sender={message.sender}
        />
      ))}
      <div ref={messagesEndRef} />
    </MessageContainer>
  );
}

export default MessageList; 