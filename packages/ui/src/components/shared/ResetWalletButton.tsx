import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import { IconButton } from '@mui/material';
import { useWalletState } from 'providers/WalletStateProvider';
import { persistor, RootState } from 'redux/store';
import { Props } from 'types';

const ResetWalletButton: FC<Props> = () => {
  const { keyring, walletState } = useWalletState();
  const { seedReady, locked } = useSelector((state: RootState) => state.app);
  const { t } = useTranslation();

  if (!seedReady || locked) {
    return null;
  }

  const doReset = async () => {
    const confirm = window.confirm('[DEV] Confirm to reset wallet?');
    if (!confirm) {
      return;
    }

    await keyring.reset();
    walletState.reset();
    await persistor.purge();
    window.location.reload();
  };

  return (
    <IconButton color='error' size='small' title={t<string>('Reset wallet')} onClick={doReset}>
      <RotateLeftIcon />
    </IconButton>
  );
};

export default ResetWalletButton;
