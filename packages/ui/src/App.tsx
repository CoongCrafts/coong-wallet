import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { keyring } from '@coong/base';
import SplashScreen from 'components/pages/SplashScreen';
import { appActions } from 'redux/slices/app';
import { RootState } from 'redux/store';
import router from 'router';
import { Props } from 'types';

const App: FC<Props> = () => {
  const { ready } = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();

  useEffectOnce(() => {
    cryptoWaitReady().then((cryptoReady) => {
      if (cryptoReady) {
        dispatch(appActions.appReady());
      } else {
        // TODO handle if browser does not support crypto!
      }
    });
  });

  useEffectOnce(() => {
    keyring.initialized().then((initialized) => {
      if (initialized) {
        dispatch(appActions.seedReady());
      }
    });
  });

  if (!ready) {
    return <SplashScreen />;
  }

  return <RouterProvider router={router} />;
};

export default App;
