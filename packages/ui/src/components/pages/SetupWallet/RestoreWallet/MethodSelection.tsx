import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { QrCode } from '@mui/icons-material';
import KeyIcon from '@mui/icons-material/Key';
import { Button, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import useThemeMode from 'hooks/useThemeMode';
import { useWalletSetup } from 'providers/WalletSetupProvider';
import { setupWalletActions } from 'redux/slices/setup-wallet';
import { RestoreWalletMethod } from 'types';

export default function MethodSelection(): JSX.Element {
  const { t } = useTranslation();
  const { dark } = useThemeMode();
  const dispatch = useDispatch();
  const { onCancelSetup } = useWalletSetup();

  const doSelectMethod = (method: RestoreWalletMethod) => {
    return () => dispatch(setupWalletActions.setRestoreWalletMethod(method));
  };

  return (
    <>
      <h3>Choose a method to restore your wallet</h3>
      <List className='mt-2'>
        <ListItemButton onClick={doSelectMethod(RestoreWalletMethod.SecretRecoveryPhrase)}>
          <ListItemIcon>
            <KeyIcon />
          </ListItemIcon>
          <ListItemText
            primary={t<string>('Secret Recovery Phrase')}
            secondary={t<string>('Enter your existing secret recovery phrase')}
          />
        </ListItemButton>
        <ListItemButton onClick={doSelectMethod(RestoreWalletMethod.QrCode)}>
          <ListItemIcon>
            <QrCode />
          </ListItemIcon>
          <ListItemText
            primary={t<string>('QR Code')}
            secondary={t<string>('Scan QR Code from Coong Wallet on a different device')}
          />
        </ListItemButton>
      </List>
      <div className='mt-4'>
        <Button onClick={onCancelSetup} color={dark ? 'grayLight' : 'gray'} variant='text'>
          {t<string>('Back')}
        </Button>
      </div>
    </>
  );
}
