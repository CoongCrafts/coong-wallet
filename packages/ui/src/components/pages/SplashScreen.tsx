import React from 'react';
import { CircularProgress, styled } from '@mui/material';
import { Props } from 'types';

const SplashScreen: React.FC<Props> = ({ className = '' }: Props) => {
  return (
    <div className={className}>
      <CircularProgress />
    </div>
  );
};

export default styled(SplashScreen)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
