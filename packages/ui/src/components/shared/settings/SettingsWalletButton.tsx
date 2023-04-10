import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import SettingsIcon from '@mui/icons-material/Settings';
import { Dialog, IconButton } from '@mui/material';
import BackupSecretPhraseDialog from 'components/shared/settings/BackupSecretPhraseDialog';
import SettingsWalletDialog from 'components/shared/settings/SettingsWalletDialog';
import { settingsDialogActions } from 'redux/slices/settings-dialog';
import { RootState } from 'redux/store';
import { Props } from 'types';
import { SettingsDialogScreen } from 'types';
import ChangeWalletPasswordDialog from './ChangeWalletPasswordDialog/ChangeWalletPasswordDialog';

interface SettingsDialogContent extends Props {
  onClose: () => void;
}
const SettingsDialogContent: FC<SettingsDialogContent> = ({ onClose }) => {
  const { settingsDialogScreen } = useSelector((state: RootState) => state.settingsDialog);

  switch (settingsDialogScreen) {
    case SettingsDialogScreen.BackupSecretPhrase:
      return <BackupSecretPhraseDialog onClose={onClose} />;
    case SettingsDialogScreen.ChangeWalletPassword:
      return <ChangeWalletPasswordDialog onClose={onClose} />;
    default:
      return <SettingsWalletDialog onClose={onClose} />;
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

    // Make sure the dialog disappears before resetting the state
    // to prevent the dialog content from changing in the transition
    setTimeout(() => dispatch(settingsDialogActions.resetState()), 50);
  };

  return (
    <>
      <IconButton size='small' title={t<string>('Open settings')} onClick={() => setOpen(true)}>
        <SettingsIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
        <SettingsDialogContent onClose={handleClose} />
      </Dialog>
    </>
  );
};

export default SettingsWalletButton;
