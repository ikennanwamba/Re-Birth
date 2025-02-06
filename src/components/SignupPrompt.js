import React, { useState } from 'react';
import styled from '@emotion/styled';

const PromptOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PromptCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin: 0.5rem 0;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  width: 100%;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const SkipButton = styled.button`
  background: none;
  border: none;
  color: #7f8c8d;
  padding: 0.5rem;
  margin-top: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    color: #34495e;
  }
`;

function SignupPrompt({ onSignup, onSkip }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Here you would integrate with your backend API
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          progress: localStorage.getItem('reflectionProgress'),
          userData: localStorage.getItem('userData')
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        onSignup(data);
      }
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <PromptOverlay>
      <PromptCard>
        <Title>🌟 Save Your Progress!</Title>
        <p>You've reached Level 2! Create an account to:</p>
        <ul>
          <li>Save your growth journey</li>
          <li>Access your conversations from any device</li>
          <li>Never lose your connection with your inner child</li>
        </ul>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit">Create Account</Button>
        </form>
        <SkipButton onClick={onSkip}>
          Maybe later
        </SkipButton>
      </PromptCard>
    </PromptOverlay>
  );
}

export default SignupPrompt; 