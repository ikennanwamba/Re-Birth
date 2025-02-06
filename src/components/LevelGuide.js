import React, { useState } from 'react';
import styled from '@emotion/styled';

const GuideContainer = styled.div`
  position: fixed;
  left: 20px;
  top: 100px;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  width: 250px;
  z-index: 100;

  @media (max-width: 768px) {
    left: 10px;
    top: auto;
    bottom: ${props => props.isOpen ? '10px' : '-100%'};
    width: calc(100% - 20px);
    transition: bottom 0.3s ease;
  }
`;

const GuideTitle = styled.h3`
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LevelList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const LevelItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
  font-size: 0.9rem;
  color: #34495e;
`;

const LevelBadge = styled.span`
  background: ${props => props.current ? '#3498db' : '#ecf0f1'};
  color: ${props => props.current ? 'white' : '#34495e'};
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  min-width: 60px;
  text-align: center;
`;

const MilestoneList = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #ecf0f1;
`;

const MilestoneItem = styled.div`
  font-size: 0.85rem;
  color: #7f8c8d;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
`;

const ToggleButton = styled.button`
  display: none;
  position: fixed;
  bottom: 10px;
  left: 10px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  z-index: 101;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);

  @media (max-width: 768px) {
    display: block;
  }
`;

function LevelGuide({ currentLevel, currentExp }) {
  const [isOpen, setIsOpen] = useState(false);

  const levels = [
    { level: 1, desc: "Beginning the Journey" },
    { level: 2, desc: "Opening Up" },
    { level: 3, desc: "Building Trust" },
    { level: 4, desc: "Deep Connection" },
    { level: 5, desc: "Inner Child Harmony" }
  ];

  const milestones = [
    { action: "Deep Reflection", exp: "+10 XP" },
    { action: "Emotional Connection", exp: "+5 XP" },
    { action: "Consistent Reflection", exp: "+20 XP" }
  ];

  return (
    <>
      <GuideContainer isOpen={isOpen}>
        <GuideTitle>
          <span>🌱</span> Growth Journey
        </GuideTitle>
        <LevelList>
          {levels.map(({ level, desc }) => (
            <LevelItem key={level}>
              <LevelBadge current={level === currentLevel}>
                Level {level}
              </LevelBadge>
              {desc}
            </LevelItem>
          ))}
        </LevelList>
        <MilestoneList>
          <GuideTitle>
            <span>⭐</span> How to Grow
          </GuideTitle>
          {milestones.map(({ action, exp }) => (
            <MilestoneItem key={action}>
              <span>{action}</span>
              <span>{exp}</span>
            </MilestoneItem>
          ))}
        </MilestoneList>
      </GuideContainer>
      <ToggleButton onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '📊'}
      </ToggleButton>
    </>
  );
}

export default LevelGuide; 