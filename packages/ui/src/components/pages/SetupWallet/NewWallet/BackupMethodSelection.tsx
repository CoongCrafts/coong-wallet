import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { QrCode } from '@mui/icons-material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import KeyIcon from '@mui/icons-material/Key';
import { Button, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import BackupWallet from 'components/pages/SetupWallet/NewWallet/BackupWallet';
import { setupWalletActions } from 'redux/slices/setup-wallet';
import { NewWalletScreenStep, BackupWalletMethod } from 'types';

const BackupWalletOptions = [
  {
    method: BackupWalletMethod.SecretRecoveryPhrase,
    icon: <KeyIcon />,
    primary: 'Secret Recovery Phrase',
    secondary: 'Write down 12 random words and keep them in a safe place!',
  },
  {
    method: BackupWalletMethod.QrCode,
    icon: <QrCode />,
    primary: 'QR Code',
    secondary: 'Downloads an encrypted QR Code and uploads it to the cloud (iCloud, Google Drive, ...)',
  },
  {
    method: BackupWalletMethod.Json,
    icon: <InsertDriveFileIcon />,
    primary: 'JSON File',
    secondary: 'Downloads an encrypted JSON file and uploads it to the cloud (iCloud, Google Drive, ...)',
  },
];

export default function BackupMethodSelection(): JSX.Element {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [method, setMethod] = useState<BackupWalletMethod>();

  const doSelectMethod = (method: BackupWalletMethod) => {
    setMethod(method);
  };

  const resetMethod = () => {
    setMethod(undefined);
  };

  const goBack = () => {
    dispatch(setupWalletActions.setNewWalletScreenStep(NewWalletScreenStep.ChooseWalletPassword));
    dispatch(setupWalletActions.setSecretPhrase(undefined));
  };

  return method !== undefined ? (
    <BackupWallet method={method} resetMethod={resetMethod} />
  ) : (
    <>
      <h3>{t<string>('Finally, back up your wallet')}</h3>
      <p>{t<string>('Choose a method to back up your wallet')}</p>
      <List>
        {BackupWalletOptions.map(({ method, icon, primary, secondary }) => (
          <ListItemButton key={method} onClick={() => doSelectMethod(method)}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={t<string>(primary)} secondary={t<string>(secondary)} />
          </ListItemButton>
        ))}
      </List>
      <Button onClick={goBack} color='gray' variant='text'>
        {t<string>('Back')}
      </Button>
    </>
  );
}
