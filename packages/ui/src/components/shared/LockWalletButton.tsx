import React, { FC } from 'react';
import { Props } from 'types';
import { Lock } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import keyring from 'keyring';
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
    <Button
      variant='outlined'
      color='warning'
      size='small'
      title='Lock the wallet'
      startIcon={<Lock />}
      onClick={doLock}>
      Lock
    </Button>
  );
};

export default LockWalletButton;
