import React, { FC } from 'react';
import { Props } from 'types';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { keyring } from '@coong/base';
import { IconButton } from '@mui/material';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';

const ResetWalletButton: FC<Props> = () => {
  const { seedReady, locked } = useSelector((state: RootState) => state.app);

  if (!seedReady || locked) {
    return null;
  }

  const doReset = async () => {
    const confirm = window.confirm('[DEV] Confirm reset wallet?');
    if (!confirm) {
      return;
    }

    await keyring.reset();
    window.location.reload();
  };

  return (
    <IconButton color='error' size='small' title='Reset wallet' onClick={doReset}>
      <RotateLeftIcon />
    </IconButton>
  );
};

export default ResetWalletButton;
