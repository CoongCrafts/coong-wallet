import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { WalletBackup } from '@coong/keyring/types';
import { LoadingButton } from '@mui/lab';
import { Button, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import BackupSecretRecoveryPhrase from 'components/pages/SetupWallet/NewWallet/BackupSecretRecoveryPhrase';
import JsonFile from 'components/shared/export/JsonFile';
import QrCode from 'components/shared/export/QrCode';
import CryptoJS from 'crypto-js';
import useSetupWallet from 'hooks/wallet/useSetupWallet';
import { RootState } from 'redux/store';
import { Props, TransferableObject, BackupWalletMethod } from 'types';

interface BackupWalletProps extends Props {
  method: BackupWalletMethod;
  resetMethod: () => void;
}

interface BackupProps extends Props {
  method: BackupWalletMethod;
}

function Backup({ method }: BackupProps): JSX.Element {
  const { password, secretPhrase } = useSelector((state: RootState) => state.setupWallet);

  // Preventing re-create the wallet backup when the component is re-rendered
  const walletBackup = useMemo(() => {
    const encryptedMnemonic = CryptoJS.AES.encrypt(secretPhrase!, password!).toString();

    return {
      encryptedMnemonic,
    } as WalletBackup;
  }, [secretPhrase, password]);

  switch (method) {
    case BackupWalletMethod.SecretRecoveryPhrase:
      return <BackupSecretRecoveryPhrase secretPhrase={secretPhrase!} />;
    case BackupWalletMethod.QrCode:
      return <QrCode value={walletBackup} object={TransferableObject.Wallet} />;
    case BackupWalletMethod.Json:
      return <JsonFile value={walletBackup} object={TransferableObject.Wallet} />;
    default:
      return <></>;
  }
}

export default function BackupWallet({ method, resetMethod }: BackupWalletProps): JSX.Element {
  const { t } = useTranslation();
  const { password, secretPhrase } = useSelector((state: RootState) => state.setupWallet);
  const { setup, loading } = useSetupWallet({ secretPhrase, password });
  const [checked, setChecked] = useState<boolean>(false);

  const handleCheckbox = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const doSetupWallet = (e: FormEvent) => {
    e.preventDefault();

    setup();
  };

  return (
    <>
      <Backup method={method} />
      <form>
        <FormGroup className='my-2'>
          <FormControlLabel
            control={<Checkbox checked={checked} onChange={handleCheckbox} disabled={loading} />}
            label={t<string>('I have backed up my wallet')}
          />
        </FormGroup>
        <div className='flex flex-row gap-4'>
          <Button variant='text' onClick={resetMethod} disabled={loading}>
            {t<string>('Back')}
          </Button>
          <LoadingButton
            onClick={doSetupWallet}
            disabled={!checked}
            fullWidth
            loading={loading}
            variant='contained'
            size='large'>
            {t<string>('Finish')}
          </LoadingButton>
        </div>
      </form>
    </>
  );
}
