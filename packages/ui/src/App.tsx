import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { useAsync } from 'react-use';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import SplashScreen from 'components/pages/SplashScreen';
import { useWalletState } from 'providers/WalletStateProvider';
import { appActions } from 'redux/slices/app';
import { RootState } from 'redux/store';
import router from 'router';
import { Props } from 'types';

const App: FC<Props> = () => {
  const { keyring } = useWalletState();
  const { ready } = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();

  useAsync(async () => {
    if (await cryptoWaitReady()) {
      dispatch(appActions.appReady());
    } else {
      // TODO handle if browser does not support crypto!
    }
  });

  useAsync(async () => {
    if (await keyring.initialized()) {
      dispatch(appActions.seedReady());
    }
  });

  if (!ready) {
    return <SplashScreen />;
  }

  return <RouterProvider router={router} />;
};

export default App;
