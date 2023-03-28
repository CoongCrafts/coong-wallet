import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Lock } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useWalletState } from 'providers/WalletStateProvider';
import { appActions } from 'redux/slices/app';
import { RootState } from 'redux/store';
import { Props } from 'types';

const LockWalletButton: FC<Props> = () => {
  const { keyring } = useWalletState();
  const dispatch = useDispatch();
  const { seedReady, locked } = useSelector((state: RootState) => state.app);
  const { t } = useTranslation();
  if (!seedReady || locked) {
    return null;
  }

  const doLock = () => {
    keyring.lock();
    dispatch(appActions.lock());
  };

  return (
    <IconButton size='small' title={t<string>('Lock the wallet')} onClick={doLock}>
      <Lock />
    </IconButton>
  );
};

export default LockWalletButton;
