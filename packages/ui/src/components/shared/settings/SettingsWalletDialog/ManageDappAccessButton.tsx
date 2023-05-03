import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import RuleIcon from '@mui/icons-material/Rule';
import { Button } from '@mui/material';
import { settingsDialogActions } from 'redux/slices/settings-dialog';
import { SettingsDialogScreen } from 'types';

export default function ManageDappAccessButton(): JSX.Element {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <Button
      className='mt-4 justify-start w-full gap-2'
      variant='outlined'
      color='gray'
      startIcon={<RuleIcon />}
      onClick={() => dispatch(settingsDialogActions.switchScreen(SettingsDialogScreen.ManageDappAccess))}>
      {t<string>('Manage Dapp Access')}
    </Button>
  );
}
