import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import SettingsIcon from '@mui/icons-material/Settings';
import { Dialog, IconButton } from '@mui/material';
import BackupSecretPhraseDialog from 'components/shared/settings/BackupSecretPhraseDialog';
import ChangeWalletPasswordDialog from 'components/shared/settings/ChangeWalletPasswordDialog';
import ManageDappAccessDialog from 'components/shared/settings/ManageDappAccessDialog';
import DappAccessDetailsDialog from 'components/shared/settings/ManageDappAccessDialog/DappAccessDetailsDialog';
import RemoveDappAccessDialog from 'components/shared/settings/ManageDappAccessDialog/RemoveDappAccessDialog';
import SettingsWalletDialog from 'components/shared/settings/SettingsWalletDialog';
import { settingsDialogActions } from 'redux/slices/settings-dialog';
import { RootState } from 'redux/store';
import { Props, SettingsDialogScreen } from 'types';

interface SettingsDialogContent extends Props {
  onClose: () => void;
}

const SettingsDialogContent: FC<SettingsDialogContent> = ({ onClose }) => {
  const { screen } = useSelector((state: RootState) => state.settingsDialog);

  switch (screen) {
    case SettingsDialogScreen.BackupSecretPhrase:
      return <BackupSecretPhraseDialog onClose={onClose} />;
    case SettingsDialogScreen.ChangeWalletPassword:
      return <ChangeWalletPasswordDialog onClose={onClose} />;
    case SettingsDialogScreen.ManageDappAccess:
      return (
        <>
          <ManageDappAccessDialog onClose={onClose} />
          <DappAccessDetailsDialog />
          <RemoveDappAccessDialog />
        </>
      );
    default:
      return <SettingsWalletDialog onClose={onClose} />;
  }
};

const SettingsWalletButton: FC<Props> = () => {
  const { open } = useSelector((state: RootState) => state.settingsDialog);
  const { seedReady, locked } = useSelector((state: RootState) => state.app);
  const { t } = useTranslation();
  const { onChangingPassword } = useSelector((state: RootState) => state.settingsDialog);
  const dispatch = useDispatch();

  if (!seedReady || locked) {
    return null;
  }

  const handleClose = () => {
    if (onChangingPassword) return;
    dispatch(settingsDialogActions.close());
  };

  const handleClick = () => {
    dispatch(settingsDialogActions.open());
  };

  return (
    <>
      <IconButton size='small' title={t<string>('Open settings')} onClick={handleClick}>
        <SettingsIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <SettingsDialogContent onClose={handleClose} />
      </Dialog>
    </>
  );
};

export default SettingsWalletButton;
