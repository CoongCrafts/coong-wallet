import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { keyring } from '@coong/base';
import { Lock } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { appActions } from 'redux/slices/app';
import { RootState } from 'redux/store';
import { Props } from 'types';

const LockWalletButton: FC<Props> = () => {
  const dispatch = useDispatch();
  const { locked } = useSelector((state: RootState) => state.app);
  if (locked) {
    return null;
  }

  const doLock = () => {
    keyring.lock();
    dispatch(appActions.lock());
  };

  return (
    <IconButton size='small' title='Lock the wallet' onClick={doLock}>
      <Lock />
    </IconButton>
  );
};

export default LockWalletButton;
