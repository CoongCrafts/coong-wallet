import React, { FC } from 'react';
import { Props } from 'types';
import { Lock } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { keyring } from '@coong/base';
import { appActions } from 'redux/slices/app';

const LockWalletButton: FC<Props> = () => {
  const dispatch = useDispatch();
  const { locked } = useSelector((state: RootState) => state.app);
  if (locked) {
    return null;
  }

  const doLock = () => {
    keyring.lock();
    dispatch(appActions.setLockStatus(keyring.locked()));
  };

  return (
    <IconButton size='small' title='Lock the wallet' onClick={doLock}>
      <Lock />
    </IconButton>
  );
};

export default LockWalletButton;
