import React, { useEffect } from 'react';
import { CircularProgress, styled } from '@mui/material';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { useDispatch } from 'react-redux';
import { appActions } from 'redux/slices/app';
import { Props } from 'types';

const SplashScreen: React.FC<Props> = ({ className = '' }: Props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    cryptoWaitReady()
      .then(() => {
        dispatch(appActions.setAppReady());
      })
      .catch((error) => {
        console.error(error);
      });
  });

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
