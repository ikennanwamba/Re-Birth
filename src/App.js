import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import ChatInterface from './components/ChatInterface';
import Onboarding from './components/Onboarding';
import LevelGuide from './components/LevelGuide';
import SignupPrompt from './components/SignupPrompt';
import { supabase } from './supabase';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
`;

const Header = styled.header`
  background-color: #2c3e50;
  color: white;
  padding: 0.5rem;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    padding: 0.3rem;
  }
`;

const Title = styled.h1`
  margin: 0;
  flex: 1;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;

  @media (max-width: 768px) {
    gap: 0.3rem;
  }
`;

const HeaderButton = styled.button`
  background-color: ${props => props.variant === 'danger' ? '#e74c3c' : '#95a5a6'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background-color: ${props => props.variant === 'danger' ? '#c0392b' : '#7f8c8d'};
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
`;

const ProgressContainer = styled.div`
  padding: 0.5rem 1rem;
  background-color: #2c3e50;
  color: white;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 8px;
  background-color: rgba(255,255,255,0.2);
  border-radius: 4px;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  width: ${props => props.percent}%;
  background-color: #3498db;
  transition: width 0.3s ease;
`;

const Level = styled.span`
  font-size: 0.9rem;
  white-space: nowrap;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  
  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

function App() {
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [userData, setUserData] = useState(null);
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('reflectionProgress');
    return saved ? JSON.parse(saved) : {
      level: 1,
      experience: 0,
      milestones: [],
      nextLevelAt: 100
    };
  });
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [session, setSession] = useState(null);

  const handleOnboardingComplete = (data) => {
    const enhancedData = {
      ...data,
      firstInteraction: new Date().toISOString(),
      lastInteraction: new Date().toISOString(),
      conversationHistory: [],
      importantMemories: [],
      emotionalMoments: [],
      relationships: [],
      themes: []
    };
    setUserData(enhancedData);
    setOnboardingComplete(true);
    localStorage.setItem('userData', JSON.stringify(enhancedData));
  };

  // Update lastInteraction whenever the chat is opened
  useEffect(() => {
    if (userData) {
      // Only update if lastInteraction has actually changed
      const currentTime = new Date().toISOString();
      if (userData.lastInteraction !== currentTime) {
        const updatedData = {
          ...userData,
          lastInteraction: currentTime
        };
        setUserData(updatedData);
        localStorage.setItem('userData', JSON.stringify(updatedData));
      }
    }
  }, []); // Empty dependency array since we only want this on mount

  const handleClearChat = () => {
    localStorage.removeItem('chatMessages');
    localStorage.removeItem('userData');
    setOnboardingComplete(false);
    setUserData(null);
    window.location.reload();
  };

  // Check if user has completed onboarding before
  React.useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
      setOnboardingComplete(true);
    }
  }, []);

  // Function to award experience points
  const awardExperience = async (amount, reason) => {
    // Update local state first
    setProgress(prev => {
      const newExp = prev.experience + amount;
      const newLevel = Math.floor(newExp / prev.nextLevelAt) + 1;
      const percentComplete = ((newExp % prev.nextLevelAt) / prev.nextLevelAt) * 100;
      
      // Show signup prompt when reaching 20% of level 1
      if (prev.level === 1 && percentComplete >= 20 && !session && !showSignupPrompt) {
        setShowSignupPrompt(true);
      }
      
      const updated = {
        ...prev,
        experience: newExp,
        level: newLevel,
        milestones: [...prev.milestones, {
          reason,
          exp: amount,
          timestamp: new Date().toISOString()
        }]
      };

      // Save to localStorage for persistence
      localStorage.setItem('reflectionProgress', JSON.stringify(updated));
      
      return updated;
    });

    // If user is authenticated, also save to Supabase
    if (session?.user?.id) {
      try {
        // Update progress in database
        const { error: progressError } = await supabase
          .from('progress')
          .update({
            level: progress.level,
            experience: progress.experience + amount,
            next_level_at: progress.nextLevelAt
          })
          .eq('user_id', session.user.id);

        if (progressError) throw progressError;

        // Save milestone
        const { error: milestoneError } = await supabase
          .from('milestones')
          .insert([{
            user_id: session.user.id,
            reason,
            exp: amount
          }]);

        if (milestoneError) throw milestoneError;
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
  };

  // Calculate percentage to next level
  const progressPercent = ((progress.experience % progress.nextLevelAt) / progress.nextLevelAt) * 100;

  const handleSignup = (userData) => {
    setOnboardingComplete(true);
    setShowSignupPrompt(false);
    // Store auth token or user data as needed
  };

  const handleResetProgress = () => {
    // Clear all stored data
    localStorage.removeItem('chatMessages');
    localStorage.removeItem('userData');
    localStorage.removeItem('reflectionProgress');
    
    // Reset state
    setProgress({
      level: 1,
      experience: 0,
      milestones: [],
      nextLevelAt: 100
    });
    setOnboardingComplete(false);
    setUserData(null);
    setShowSignupPrompt(false);

    // Reload the app to start fresh
    window.location.reload();
  };

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) {
        setSession(session);
        if (session) {
          fetchUserData(session.user.id);
        }
      }
    };

    initSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
        if (session) {
          fetchUserData(session.user.id);
        }
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []); // Empty dependency array since we only want this on mount

  const fetchUserData = async (userId) => {
    try {
      // Fetch user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      // Fetch progress data
      const { data: progressData, error: progressError } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (progressError) throw progressError;

      // Fetch conversations
      const { data: conversations, error: conversationsError } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: true });

      if (conversationsError) throw conversationsError;

      // Fetch milestones
      const { data: milestones, error: milestonesError } = await supabase
        .from('milestones')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

      if (milestonesError) throw milestonesError;

      // Set all the data
      setUserData(userData);
      setProgress({
        level: progressData.level,
        experience: progressData.experience,
        nextLevelAt: progressData.next_level_at,
        milestones: milestones
      });
      setOnboardingComplete(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  if (!onboardingComplete) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <AppContainer>
      <Header>
        <HeaderLeft>
          <Title>Re:Birth</Title>
          {onboardingComplete && (
            <NavButton onClick={() => {
              setOnboardingComplete(false);
              setUserData(null);
            }}>
              🏠 Home
            </NavButton>
          )}
        </HeaderLeft>
        <HeaderRight>
          {session ? (
            <>
              <NavButton onClick={async () => {
                await supabase.auth.signOut();
                setSession(null);
                setOnboardingComplete(false);
                setUserData(null);
                localStorage.clear();
              }}>
                👋 Logout
              </NavButton>
              <HeaderButton onClick={handleResetProgress}>
                Reset Progress
              </HeaderButton>
              <HeaderButton variant="danger" onClick={handleClearChat}>
                Clear Chat
              </HeaderButton>
            </>
          ) : (
            <NavButton onClick={() => setShowSignupPrompt(true)}>
              ✨ Save Progress
            </NavButton>
          )}
        </HeaderRight>
      </Header>
      <ProgressContainer>
        <Level>Level {progress.level}</Level>
        <ProgressBar>
          <Progress percent={progressPercent} />
        </ProgressBar>
        <Level>{Math.round(progressPercent)}%</Level>
      </ProgressContainer>
      <LevelGuide 
        currentLevel={progress.level}
        currentExp={progress.experience}
      />
      <ChatInterface 
        userData={userData} 
        onMilestone={(exp, reason) => awardExperience(exp, reason)}
        session={session}
      />
      {showSignupPrompt && (
        <SignupPrompt
          onSignup={handleSignup}
          onSkip={() => setShowSignupPrompt(false)}
        />
      )}
    </AppContainer>
  );
}

export default App;
