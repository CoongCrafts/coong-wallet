import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { WalletQrBackup } from '@coong/keyring/types';
import { Alert } from '@mui/material';
import PasswordPromptForm from 'components/shared/forms/PasswordPromptForm';
import { useWalletSetup } from 'providers/WalletSetupProvider';
import { useWalletState } from 'providers/WalletStateProvider';
import { appActions } from 'redux/slices/app';
import { Props } from 'types';

interface TransferWalletBackupProps extends Props {
  backup: WalletQrBackup;
  resetBackup: () => void;
}

export default function TransferWalletBackup({ backup, resetBackup }: TransferWalletBackupProps): JSX.Element {
  const { t } = useTranslation();
  const { keyring } = useWalletState();
  const dispatch = useDispatch();
  const { onWalletSetup } = useWalletSetup();

  const importBackup = async (password: string) => {
    await keyring.importQrBackup(backup, password);

    dispatch(appActions.seedReady());
    dispatch(appActions.unlock());

    toast.success(t<string>('Wallet imported'));

    onWalletSetup();
  };

  return (
    <>
      <h3>{t<string>('Import wallet')}</h3>
      <p className='mb-4'>{t<string>('Enter wallet password to import your wallet')}</p>
      <PasswordPromptForm onSubmit={importBackup} onBack={resetBackup} />
      <Alert className='mt-4' severity='info'>
        {t<string>(
          'The wallet import process might take time if there are many accounts in the backup, please be patient.',
        )}
      </Alert>
    </>
  );
}
