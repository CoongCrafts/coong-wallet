import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { QrCode } from '@mui/icons-material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import KeyIcon from '@mui/icons-material/Key';
import { Button, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import BackupWallet from 'components/pages/SetupWallet/NewWallet/BackupWallet';
import { setupWalletActions } from 'redux/slices/setup-wallet';
import { NewWalletScreenStep, WalletRecoveryMethod } from 'types';

const BackupWalletOptions = [
  {
    method: WalletRecoveryMethod.SecretRecoveryPhrase,
    icon: <KeyIcon />,
    description: 'Write down 12 random words and keep them in a safe place!',
  },
  {
    method: WalletRecoveryMethod.QrCode,
    icon: <QrCode />,
    description: 'Downloads an encrypted QR Code and uploads it to the cloud (iCloud, Google Drive, ...)',
  },
  {
    method: WalletRecoveryMethod.JsonFile,
    icon: <InsertDriveFileIcon />,
    description: 'Downloads an encrypted JSON file and uploads it to the cloud (iCloud, Google Drive, ...)',
  },
];

export default function BackupMethodSelection(): JSX.Element {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [method, setMethod] = useState<WalletRecoveryMethod>();

  const doSelectMethod = (method: WalletRecoveryMethod) => {
    setMethod(method);
  };

  const resetMethod = () => {
    setMethod(undefined);
  };

  const goBack = () => {
    dispatch(setupWalletActions.setNewWalletScreenStep(NewWalletScreenStep.ChooseWalletPassword));
    dispatch(setupWalletActions.setSecretPhrase(undefined));
  };

  if (method) {
    return <BackupWallet method={method} resetMethod={resetMethod} />;
  }

  return (
    <>
      <h3>{t<string>('Finally, back up your wallet')}</h3>
      <p>{t<string>('Choose a method to back up your wallet')}</p>
      <List>
        {BackupWalletOptions.map(({ method, icon, description }) => (
          <ListItemButton key={method} onClick={() => doSelectMethod(method)}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={t<string>(method)} secondary={t<string>(description)} />
          </ListItemButton>
        ))}
      </List>
      <Button onClick={goBack} color='gray' variant='text'>
        {t<string>('Back')}
      </Button>
    </>
  );
}
