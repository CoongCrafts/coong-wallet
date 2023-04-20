import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { QrCode } from '@mui/icons-material';
import KeyIcon from '@mui/icons-material/Key';
import { Button, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import useThemeMode from 'hooks/useThemeMode';
import useOnWalletInitialized from 'hooks/wallet/useOnWalletInitialized';
import { Props } from 'types';

interface RestoreWalletProps extends Props {
  onWalletSetup?: () => void;
}

export default function RestoreWallet({ onWalletSetup }: RestoreWalletProps): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { dark } = useThemeMode();

  useOnWalletInitialized(onWalletSetup);

  return (
    <div className='max-w-[450px] mt-8 mb-16 mx-auto'>
      <h3>Choose a method to restore your wallet</h3>
      <List className='mt-2'>
        <ListItemButton onClick={() => navigate('/restore-wallet/secret-recovery-phrase')}>
          <ListItemIcon>
            <KeyIcon />
          </ListItemIcon>
          <ListItemText primary='Secret Recovery Phrase' secondary='Enter your existing secret recovery phrase' />
        </ListItemButton>
        <ListItemButton onClick={() => navigate('/restore-wallet/qrcode')}>
          <ListItemIcon>
            <QrCode />
          </ListItemIcon>
          <ListItemText primary='QR Code' secondary='Scan QR Code from Coong Wallet on a different device' />
        </ListItemButton>
      </List>
      <div className='mt-4'>
        <Button onClick={() => navigate('/')} color={dark ? 'grayLight' : 'gray'} variant='text'>
          {t<string>('Back')}
        </Button>
      </div>
    </div>
  );
}
