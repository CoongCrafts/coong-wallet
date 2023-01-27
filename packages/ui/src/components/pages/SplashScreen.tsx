import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { keyring } from '@coong/base';
import { CircularProgress, styled } from '@mui/material';
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

  useEffect(() => {
    keyring.initialized().then((initialized) => {
      if (initialized) {
        dispatch(appActions.setSeedReady());
        dispatch(appActions.setLockStatus(keyring.locked()));
      }
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
