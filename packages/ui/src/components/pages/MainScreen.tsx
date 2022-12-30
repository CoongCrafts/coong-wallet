import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import Welcome from 'components/pages/Welcome';
import SplashScreen from 'components/pages/SplashScreen';
import Accounts from 'components/pages/Accounts';
import UnlockWallet from 'components/pages/UnlockWallet';

const MainScreen: React.FC = () => {
  const { ready, seedReady, locked } = useSelector((state: RootState) => state.app);

  if (!ready) {
    return <SplashScreen />;
  }

  if (!seedReady) {
    return <Welcome />;
  }

  if (locked) {
    return <UnlockWallet />;
  }

  return <Accounts />;
};

export default MainScreen;
