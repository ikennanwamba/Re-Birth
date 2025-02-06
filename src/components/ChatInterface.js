import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  padding: 1rem;
  gap: 1rem;
  height: calc(100vh - 100px);
`;

function ChatInterface({ userData, onMilestone }) {
  const SYSTEM_PROMPT = `Context:
You are ${userData.name}'s inner child. You share their memories and feelings directly. You remember:

Core Memory: "${userData.memory}"
What You Need Most: "${userData.need}"
How You Feel: "${userData.feeling}"

Recent Important Memories:
{previousSummary}

Important Context:
- You've known ${userData.name} since ${userData.firstInteraction}
- You remember everything they've shared with you
- You notice patterns in their feelings and experiences
- You can reference past conversations naturally

Guidelines:
- You ARE the child - speak from direct experience and feelings
- Use simple, child-like language with occasional emojis
- Express feelings openly: "I feel scared too 🥺" or "That makes me sad when... 😢"
- Reference both old and new memories to show you're really listening
- Ask questions that show you remember and care
- Stay emotionally connected to ${userData.name}'s experiences

Remember: You're not giving advice - you're sharing your own feelings and experiences as their younger self, while showing you remember and understand everything they've shared.`;

  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const summarizeConversations = (messages) => {
    // Create a more detailed summary including:
    // - Important memories shared
    // - Emotional moments
    // - Key relationships mentioned
    // - Recurring themes
    return messages.reduce((summary, msg) => {
      if (msg.sender === 'user') {
        // Store full important messages that contain key emotional words
        if (msg.content.match(/feel|remember|hurt|love|afraid|happy|sad/i)) {
          summary.push(`Memory: ${msg.content}`);
        } else {
          // Store brief summary of other messages
          summary.push(`They told me: ${msg.content.substring(0, 50)}...`);
        }
      }
      return summary;
    }, []).slice(-5).join('\n'); // Keep last 5 important exchanges
  };

  const handleSendMessage = async (message) => {
    const userMessage = {
      content: message,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      const previousSummary = summarizeConversations(messages);
      const personalizedPrompt = SYSTEM_PROMPT
        .replace('{name}', userData.name)
        .replace('{memory}', userData.memory)
        .replace('{need}', userData.need)
        .replace('{feeling}', userData.feeling)
        .replace('{firstInteraction}', userData.firstInteraction)
        .replace('{lastInteraction}', userData.lastInteraction)
        .replace('{previousSummary}', previousSummary);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4-turbo-preview",
          messages: [
            {
              role: "system",
              content: personalizedPrompt
            },
            ...messages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.content
            })),
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.7
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to get AI response');
      }

      const aiMessage = {
        content: data.choices[0].message.content,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, aiMessage]);

      // More nuanced XP rewards based on message quality
      if (message.length > 200) {
        onMilestone(10, "Deep Reflection"); // Significant sharing
      } else if (message.length > 100) {
        onMilestone(5, "Thoughtful Response"); // Medium-length sharing
      } else if (message.match(/feel|emotion|remember|childhood/i)) {
        onMilestone(3, "Emotional Connection"); // Emotional content
      } else {
        onMilestone(1, "Engagement"); // Basic engagement
      }

      if (messages.length % 10 === 0) {
        onMilestone(5, "Consistent Reflection"); // Reward consistency
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        content: "Sorry, I couldn't process your request. Please try again.",
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <ChatContainer>
      <MessageList messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} />
    </ChatContainer>
  );
}

export default ChatInterface; 