import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { WalletBackup } from '@coong/keyring/types';
import TransferWalletBackup from 'components/pages/SetupWallet/RestoreWallet/TransferWalletBackup';
import JsonFileReader from 'components/shared/import/JsonFileReader';
import { useWalletState } from 'providers/WalletStateProvider';
import { WalletBackupSchema } from 'validations/WalletBackup';

export default function ImportJsonFile(): JSX.Element {
  const { t } = useTranslation();
  const [backup, setBackup] = useState<WalletBackup>();
  const { keyring } = useWalletState();

  const importBackup = async (password: string) => {
    if (!backup) return;
    await keyring.importBackup(backup, password);
  };

  const onReadFileComplete = async (data: string) => {
    try {
      const parsedBackup = JSON.parse(data) as WalletBackup;
      await WalletBackupSchema.validate(parsedBackup);

      setBackup(parsedBackup);
    } catch (e: any) {
      toast.dismiss();
      toast.error(t<string>('Unknown/Invalid JSON File'));
    }
  };

  const resetBackup = () => {
    setBackup(undefined);
  };

  return backup ? (
    <TransferWalletBackup importBackup={importBackup} resetBackup={resetBackup} />
  ) : (
    <JsonFileReader onResult={onReadFileComplete} showTitle showBackButton />
  );
}
