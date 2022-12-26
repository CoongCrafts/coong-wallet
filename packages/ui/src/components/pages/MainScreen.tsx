import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import Welcome from 'components/pages/Welcome';
import SplashScreen from 'components/pages/SplashScreen';
import Accounts from 'components/pages/Accounts';

const MainScreen: React.FC = () => {
  const { ready, seedReady } = useSelector((state: RootState) => state.app);

  if (ready) {
    if (seedReady) {
      return <Accounts />;
    } else {
      return <Welcome />;
    }
  } else {
    return <SplashScreen />;
  }
};

export default MainScreen;
