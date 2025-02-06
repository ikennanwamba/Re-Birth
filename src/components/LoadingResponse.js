import React from 'react';
import styled from '@emotion/styled';

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
`;

const ThinkingBubbles = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;

  span {
    width: 12px;
    height: 12px;
    background-color: #3498db;
    border-radius: 50%;
    display: inline-block;
    animation: bounce 1.4s infinite ease-in-out both;

    &:nth-of-type(1) { animation-delay: -0.32s; }
    &:nth-of-type(2) { animation-delay: -0.16s; }
  }

  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }
`;

const LoadingText = styled.p`
  color: #7f8c8d;
  font-size: 1rem;
  margin: 0;
  font-style: italic;
`;

const ChildIcon = styled.div`
  font-size: 2rem;
  animation: think 2s infinite ease-in-out;

  @keyframes think {
    0% { transform: rotate(-5deg); }
    50% { transform: rotate(5deg); }
    100% { transform: rotate(-5deg); }
  }
`;

function LoadingResponse() {
  return (
    <LoadingContainer>
      <ChildIcon>👶</ChildIcon>
      <ThinkingBubbles>
        <span></span>
        <span></span>
        <span></span>
      </ThinkingBubbles>
      <LoadingText>Your inner child is thinking...</LoadingText>
    </LoadingContainer>
  );
}

export default LoadingResponse; 