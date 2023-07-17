import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { QrCode } from '@mui/icons-material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import KeyIcon from '@mui/icons-material/Key';
import { Button, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useWalletSetup } from 'providers/WalletSetupProvider';
import { setupWalletActions } from 'redux/slices/setup-wallet';
import { WalletRecoveryMethod } from 'types';

const MethodInfo = [
  {
    method: WalletRecoveryMethod.SecretRecoveryPhrase,
    icon: <KeyIcon />,
    primary: 'Secret Recovery Phrase',
    secondary: 'Enter your existing secret recovery phrase',
  },
  {
    method: WalletRecoveryMethod.QrCode,
    icon: <QrCode />,
    primary: 'QR Code',
    secondary: 'Scan QR Code from Coong Wallet on a different device',
  },
  {
    method: WalletRecoveryMethod.JsonFile,
    icon: <InsertDriveFileIcon />,
    primary: 'JSON File',
    secondary: 'Import JSON backup file exported from Coong Wallet',
  },
];

export default function MethodSelection(): JSX.Element {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { onCancelSetup } = useWalletSetup();

  const doSelectMethod = (method: WalletRecoveryMethod) => {
    return () => dispatch(setupWalletActions.setRestoreWalletMethod(method));
  };

  return (
    <>
      <h3>Choose a method to restore your wallet</h3>
      <List className='mt-2'>
        {MethodInfo.map(({ method, icon, primary, secondary }) => (
          <ListItemButton key={method} onClick={doSelectMethod(method)}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={t<string>(primary)} secondary={t<string>(secondary)} />
          </ListItemButton>
        ))}
      </List>
      <div className='mt-4'>
        <Button onClick={onCancelSetup} color='gray' variant='text'>
          {t<string>('Back')}
        </Button>
      </div>
    </>
  );
}
