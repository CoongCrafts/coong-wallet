import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import LockIcon from '@mui/icons-material/Lock';
import { Button } from '@mui/material';
import useThemeMode from 'hooks/useThemeMode';
import { settingsDialogActions } from 'redux/slices/settings-dialog';
import { Props, SettingsDialogScreen } from 'types';

const ChangeWalletPasswordButton: FC<Props> = () => {
  const { t } = useTranslation();
  const { dark } = useThemeMode();
  const dispatch = useDispatch();

  return (
    <Button
      className='mt-4 justify-start w-full gap-2'
      variant='outlined'
      color={dark ? 'grayLight' : 'gray'}
      startIcon={<LockIcon />}
      onClick={() => dispatch(settingsDialogActions.switchScreen(SettingsDialogScreen.ChangeWalletPassword))}>
      {t<string>('Change Wallet Password')}
    </Button>
  );
};

export default ChangeWalletPasswordButton;
