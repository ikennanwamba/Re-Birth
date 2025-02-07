import React from 'react';
import styled from '@emotion/styled';

const ProgressContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  position: relative;
  max-width: 400px;
  margin: 0 auto 2rem auto;
`;

const StepBar = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: #e0e0e0;
  z-index: 1;
`;

const Progress = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  height: 2px;
  background: #3498db;
  width: ${props => ((props.currentStep - 1) / (props.totalSteps - 1)) * 100}%;
  transition: width 0.3s ease;
  z-index: 2;
`;

const StepsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  position: relative;
  z-index: 3;
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const StepDot = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.active ? '#3498db' : props.completed ? '#2ecc71' : '#e0e0e0'};
  border: 3px solid white;
  box-shadow: 0 0 0 2px ${props => props.active ? '#3498db' : props.completed ? '#2ecc71' : '#e0e0e0'};
  transition: all 0.3s ease;
`;

const StepLabel = styled.span`
  font-size: 0.75rem;
  color: ${props => props.active ? '#3498db' : props.completed ? '#2ecc71' : '#95a5a6'};
  position: absolute;
  top: 30px;
  width: 80px;
  text-align: center;
  margin-left: -28px;
`;

const steps = [
  'Welcome',
  'Name',
  'Story',
  'Connection',
  'Feelings',
  'Needs',
  'Begin'
];

function ProgressBar({ currentStep }) {
  return (
    <ProgressContainer>
      <StepBar />
      <Progress currentStep={currentStep} totalSteps={steps.length} />
      <StepsContainer>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepDot 
              completed={currentStep > index + 1}
              active={currentStep === index + 1}
            />
            <StepLabel
              completed={currentStep > index + 1}
              active={currentStep === index + 1}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </StepsContainer>
    </ProgressContainer>
  );
}

export default ProgressBar; 