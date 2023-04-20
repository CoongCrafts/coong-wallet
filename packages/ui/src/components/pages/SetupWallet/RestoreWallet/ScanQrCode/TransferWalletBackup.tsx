import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { WalletQrBackup } from '@coong/keyring/types';
import { Alert } from '@mui/material';
import PasswordPromptForm from 'components/shared/forms/PasswordPromptForm';
import { useWalletState } from 'providers/WalletStateProvider';
import { appActions } from 'redux/slices/app';
import { Props } from 'types';

interface TransferWalletBackupProps extends Props {
  backup: WalletQrBackup;
}

export default function dataTransferWalletBackup({ backup }: TransferWalletBackupProps): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { keyring } = useWalletState();
  const dispatch = useDispatch();

  const importBackup = async (password: string) => {
    await keyring.importQrBackup(backup, password);

    dispatch(appActions.seedReady());
    dispatch(appActions.unlock());
    navigate('/');
  };

  const goBack = () => {
    navigate('/restore-wallet');
  };

  return (
    <>
      <h3>{t<string>('Import wallet & accounts')}</h3>
      <p className='mb-4'>Enter wallet password to import your wallet and accounts</p>
      <PasswordPromptForm onSubmit={importBackup} onBack={goBack} />
      <Alert className='mt-4' severity='info'>
        {t<string>(
          'The wallet import process might take time if there are many accounts in the backup, please be patient.',
        )}
      </Alert>
    </>
  );
}
