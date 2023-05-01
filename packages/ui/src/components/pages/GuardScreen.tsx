import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import UnlockWallet from 'components/pages/UnlockWallet';
import Welcome from 'components/pages/Welcome';
import useLockTimer from 'hooks/wallet/useLockTimer';
import { RootState } from 'redux/store';

export default function GuardScreen(): JSX.Element {
  const { seedReady, locked } = useSelector((state: RootState) => state.app);
  const { pathname } = useLocation();

  useLockTimer();

  if (!seedReady) {
    const isRootPath = pathname === '/' || pathname === '';
    if (isRootPath) {
      return <Welcome />;
    } else {
      window.location.href = '/';
      return <></>;
    }
  }

  if (locked) {
    return <UnlockWallet />;
  }

  return <Outlet />;
}
