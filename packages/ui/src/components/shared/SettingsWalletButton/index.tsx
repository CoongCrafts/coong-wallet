import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import SettingsIcon from '@mui/icons-material/Settings';
import { Dialog, IconButton } from '@mui/material';
import { RootState } from 'redux/store';
import { Props } from 'types';
import { settingsDialogActions, SettingsDialogScreen } from '../../../redux/slices/settings-dialog';
import BackupSecretPhrase from './BackupSecretPhrase';
import ChangeWalletPassword from './ChangeWalletPassword';
import Settings from './Settings';

interface SettingsDialogProps extends Props {
  onClose: any;
}
const SettingsDialog: FC<SettingsDialogProps> = ({ onClose }) => {
  const { settingsDialogScreen } = useSelector((state: RootState) => state.settingsDialog);

  switch (settingsDialogScreen) {
    case SettingsDialogScreen.BackupSecretPhrase:
      return <BackupSecretPhrase onClose={onClose} />;
    case SettingsDialogScreen.ChangeWalletPassword:
      return <ChangeWalletPassword onClose={onClose} />;
    default:
      return <Settings onClose={onClose} />;
  }
};

const SettingsWalletButton: FC<Props> = () => {
  const [open, setOpen] = useState(false);
  const { seedReady, locked } = useSelector((state: RootState) => state.app);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  if (!seedReady || locked) {
    return null;
  }

  const handleClose = () => {
    setOpen(false);
    dispatch(settingsDialogActions.switchSettingsDialogScreen(SettingsDialogScreen.Settings));
    dispatch(settingsDialogActions.setPassword(''));
  };

  return (
    <>
      <IconButton size='small' title={t<string>('Open settings')} onClick={() => setOpen(true)}>
        <SettingsIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
        <SettingsDialog onClose={handleClose} />
      </Dialog>
    </>
  );
};

export default SettingsWalletButton;
