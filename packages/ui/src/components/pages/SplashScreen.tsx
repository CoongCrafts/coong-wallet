import React from 'react';
import { CircularProgress } from '@mui/material';
import { Props } from 'types';

const SplashScreen: React.FC<Props> = ({ className = '' }: Props) => {
  return (
    <div className={`${className} w-full h-full flex justify-center items-center`}>
      <CircularProgress />
    </div>
  );
};

export default SplashScreen;
