import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import LoadingResponse from './LoadingResponse';
import ProgressBar from './ProgressBar';
import { supabase } from '../supabase';

const OnboardingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: #f5f5f5;
  text-align: center;
`;

const Card = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
`;

const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin: 1rem 0;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  margin: 1rem 0;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
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
  
  &:hover {
    background-color: #2980b9;
  }
`;

const EmojiScale = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 1rem 0;
`;

const EmojiButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  opacity: ${props => props.selected ? 1 : 0.5};
  transform: ${props => props.selected ? 'scale(1.2)' : 'scale(1)'};
  transition: all 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const ResponseContent = styled.div`
  position: relative;
  overflow: hidden;
  max-height: ${props => props.expanded ? 'none' : '150px'};
  transition: max-height 0.3s ease-out;
  font-style: italic;
  margin: 1rem 0;
  font-size: 1.1rem;
  color: #2c3e50;
  line-height: 1.6;
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #3498db;
`;

const ReadMoreButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  font-size: 0.9rem;
  padding: 4px 0;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 8px;
  
  &:hover {
    color: #0056b3;
  }
`;

const SkipButton = styled.button`
  background: none;
  border: none;
  color: #95a5a6;
  font-size: 0.9rem;
  margin-top: 1rem;
  cursor: pointer;
  text-decoration: underline;
  
  &:hover {
    color: #7f8c8d;
  }
`;

const LoginContainer = styled.div`
  margin-top: 2rem;
  text-align: center;
`;

const LoginToggle = styled.button`
  background: none;
  border: none;
  color: #3498db;
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.9rem;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: #f5f5f5;
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  background-color: #fde8e7;
  padding: 0.8rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    name: '',
    memory: '',
    feeling: '',
    need: '',
    emotionalResponse: ''
  });
  const [aiResponse, setAiResponse] = useState('');
  const [expanded, setExpanded] = useState(false);
  const responseRef = useRef(null);
  const [showButton, setShowButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (responseRef.current && step === 4) {
      setShowButton(responseRef.current.scrollHeight > 150);
    }
  }, [aiResponse, step]);

  const getAIResponse = async (prompt) => {
    try {
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
              content: `You are using theory of mind to embody the user's inner child based on their shared memory. 
              
Through their memory, understand and channel their childhood interests, feelings, and personality. Respond in a way that authentically reflects their younger self's perspective and emotional world.

Start with "H-hi ${userData.name}..." and then speak from the perspective of their inner child, referencing elements from their specific memory. Keep responses childlike, genuine, and connected to their shared experience.`
            },
            {
              role: "user",
              content: `My name is ${userData.name}. Here's my memory: ${prompt}`
            }
          ],
          temperature: 0.7
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error:', error);
      return "H-hi... I'm having trouble remembering right now. Can you help me?";
    }
  };

  const handleNext = async () => {
    if (step === 3) {
      setIsLoading(true);
      try {
        // Get AI response after memory is shared
        const response = await getAIResponse(userData.memory);
        setAiResponse(response);
        setIsLoading(false);
        // Only move to next step after we have the response
        setStep(step + 1);
      } catch (error) {
        console.error('Error:', error);
        setIsLoading(false);
      }
    } else if (step < 7) {
      setStep(step + 1);
    } else {
      onComplete(userData);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      console.log('Starting login...');
      
      // First check if user exists
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log('Sign in result:', { user, error: signInError });

      if (signInError) {
        throw signInError;
      }

      if (!user) {
        throw new Error('No user returned from authentication');
      }

      // Get user profile with session token
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      console.log('Profile fetch:', { profile, profileError });

      if (profileError) {
        throw profileError;
      }

      // Check for progress record
      const { data: progressData, error: progressError } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!progressData && !progressError) {
        // Create progress record if it doesn't exist
        await supabase
          .from('progress')
          .insert({
            user_id: user.id,
            level: 1,
            experience: 0,
            next_level_at: 100
          });
      }

      onComplete(profile);
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to login. Please try again.');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // First create the auth user
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: email.split('@')[0]
          }
        }
      });

      if (signUpError) throw signUpError;

      if (user) {
        // Create all necessary records in a transaction-like sequence
        try {
          // 1. Create user profile
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .insert({
              id: user.id,
              name: email.split('@')[0],
              memory: 'First time logging in',
              feeling: '😊',
              need: 'Getting started',
              first_interaction: new Date().toISOString(),
              last_interaction: new Date().toISOString()
            })
            .select()
            .single();

          if (profileError) throw profileError;

          // 2. Create progress record
          const { error: progressError } = await supabase
            .from('progress')
            .insert({
              user_id: user.id,
              level: 1,
              experience: 0,
              next_level_at: 100
            });

          if (progressError) throw progressError;

          // 3. Create initial milestone
          const { error: milestoneError } = await supabase
            .from('milestones')
            .insert({
              user_id: user.id,
              reason: 'Started healing journey',
              exp: 50
            });

          if (milestoneError) throw milestoneError;
          
          onComplete(profile);
        } catch (error) {
          // If any creation fails, we should handle cleanup
          console.error('Error during profile setup:', error);
          throw new Error('Failed to set up user profile. Please try again.');
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'Failed to sign up. Please try again.');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Title>Welcome to Re:Birth</Title>
            <p>We help you reconnect with your younger self so you can heal and thrive.</p>
            <Button onClick={handleNext}>Let's Begin</Button>
          </>
        );
      case 2:
        return (
          <>
            <Title>What's your first name or nickname?</Title>
            <Input
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              placeholder="Enter your name"
            />
            <Button onClick={handleNext} disabled={!userData.name}>Next</Button>
            {userData.name && (
              <SkipButton
                onClick={() => onComplete({
                  name: userData.name,
                  memory: 'Taking the first step towards healing by starting a direct conversation.',
                  feeling: '😊',
                  need: 'Understanding and connection',
                  firstInteraction: new Date().toISOString(),
                  lastInteraction: new Date().toISOString(),
                  conversationHistory: [],
                  importantMemories: [],
                  emotionalMoments: [],
                  relationships: [],
                  themes: []
                })}
              >
                Skip onboarding and start chatting
              </SkipButton>
            )}
          </>
        );
      case 3:
        return (
          <>
            <Title>Share your childhood story</Title>
            {isLoading ? (
              <LoadingResponse />
            ) : (
              <>
                <p style={{
                  color: '#2c3e50',
                  marginBottom: '1rem',
                  lineHeight: '1.6',
                  fontSize: '1.1rem'
                }}>
                  Take a moment to share your childhood journey. Start small - even a single memory is perfect.
                  For example:
                </p>
                <div style={{
                  background: '#f8f9fa',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  fontStyle: 'italic'
                }}>
                  "I remember when I was 7, my favorite place was under the big tree in our backyard. 
                  I used to sit there and read books after school. It felt like my own special spot."
                </div>
                <p style={{
                  color: '#666',
                  marginBottom: '1rem',
                  fontSize: '0.95rem'
                }}>
                  Your story could be about:
                  • A special place you felt safe
                  • A moment that made you happy or sad
                  • Someone who was important to you
                  • A regular day you remember clearly
                </p>
                <TextArea
                  value={userData.memory}
                  onChange={(e) => setUserData({ ...userData, memory: e.target.value })}
                  placeholder="Share what feels comfortable..."
                  style={{
                    minHeight: '150px',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    padding: '1rem'
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                  <Button onClick={handleNext} disabled={!userData.memory}>
                    Continue
                  </Button>
                  <SkipButton
                    onClick={() => {
                      setUserData(prev => ({
                        ...prev,
                        memory: "I'm not ready to share just yet, but I'd like to talk."
                      }));
                      handleNext();
                    }}
                  >
                    Skip for now - I'd like to just talk
                  </SkipButton>
                </div>
              </>
            )}
          </>
        );
      case 4:
        return (
          <>
            <Title>Your younger self wants to connect</Title>
            {isLoading ? (
              <LoadingResponse />
            ) : (
              <>
                <ResponseContent ref={responseRef} expanded={expanded}>
                  {aiResponse}
                </ResponseContent>
                {showButton && (
                  <ReadMoreButton onClick={() => setExpanded(!expanded)}>
                    {expanded ? 'Show less' : 'Read more...'}
                  </ReadMoreButton>
                )}
                <Button onClick={handleNext}>Continue</Button>
              </>
            )}
          </>
        );
      case 5:
        return (
          <>
            <Title>How do you feel seeing your memory echoed back?</Title>
            <EmojiScale>
              {['😢', '😔', '😐', '😊', '🥰'].map((emoji, index) => (
                <EmojiButton
                  key={index}
                  selected={userData.feeling === emoji}
                  onClick={() => {
                    setUserData({ ...userData, feeling: emoji });
                  }}
                >
                  {emoji}
                </EmojiButton>
              ))}
            </EmojiScale>
            <Button onClick={handleNext} disabled={!userData.feeling}>Next</Button>
          </>
        );
      case 6:
        return (
          <>
            <Title>What does your younger self need most?</Title>
            <p>If you could give your younger self just one thing they truly needed—what would it be?</p>
            <Input
              value={userData.need}
              onChange={(e) => setUserData({ ...userData, need: e.target.value })}
              placeholder="Love, acceptance, reassurance, a friend..."
            />
            <Button onClick={handleNext} disabled={!userData.need}>Next</Button>
          </>
        );
      case 7:
        return (
          <>
            <Title>Ready to begin your healing journey</Title>
            <p>You've just had a glimpse of the healing conversation ahead. Ready for your first full session?</p>
            <Button onClick={handleNext}>Start My Session</Button>
          </>
        );
      default:
        return null;
    }
  };

  if (showLogin) {
    return (
      <Container>
        <Title>Welcome Back! 👋</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <LoginForm onSubmit={handleLogin}>
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
          <Button type="submit">Login</Button>
        </LoginForm>
        <LoginContainer>
          <LoginToggle onClick={() => setShowLogin(false)}>
            New here? Start your journey
          </LoginToggle>
        </LoginContainer>
      </Container>
    );
  }

  return (
    <OnboardingContainer>
      <Card>
        <ProgressBar currentStep={step} />
        {renderStep()}
      </Card>
      <LoginContainer>
        <LoginToggle onClick={() => setShowLogin(true)}>
          Already have an account? Login
        </LoginToggle>
      </LoginContainer>
    </OnboardingContainer>
  );
}

export default Onboarding; 