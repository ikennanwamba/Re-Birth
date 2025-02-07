import React from 'react';
import styled from '@emotion/styled';

const ProgressContainer = styled.div`
  width: 100%;
  margin-bottom: 2rem;
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const Step = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#3498db' : '#e0e0e0'};
  transition: background-color 0.3s ease;
`;

const Bar = styled.div`
  width: 100%;
  height: 4px;
  background-color: #e0e0e0;
  border-radius: 2px;
  overflow: hidden;
`;

const Progress = styled.div`
  width: ${props => (props.currentStep / 7) * 100}%;
  height: 100%;
  background-color: #3498db;
  transition: width 0.3s ease;
`;

function ProgressBar({ currentStep = 1 }) {
  return (
    <ProgressContainer>
      <StepIndicator>
        {[1, 2, 3, 4, 5, 6, 7].map(step => (
          <Step key={step} active={step <= currentStep} />
        ))}
      </StepIndicator>
      <Bar>
        <Progress currentStep={currentStep} />
      </Bar>
    </ProgressContainer>
  );
}

export default ProgressBar; 