import { AccountBackup } from '@coong/keyring/types';
import { AccountInfoExt, Props } from 'types';
import { useWalletState } from '../../../providers/WalletStateProvider';
import { EventName, triggerEvent } from '../../../utils/eventemitter';
import AccountCard from '../../pages/Accounts/AccountCard';
import PasswordPromptForm from '../forms/PasswordPromptForm';

interface TransferAccountBackupProps extends Props {
  backup: AccountBackup;
  resetBackup: () => void;
  onClose: () => void;
}

function TransferAccountBackup({ backup, resetBackup, onClose }: TransferAccountBackupProps): JSX.Element {
  const { keyring } = useWalletState();
  const {
    meta: { name },
    address,
    hashedSeed,
  } = backup;
  const isExternal = !hashedSeed || keyring.isExternal(hashedSeed);

  const accountInfo: AccountInfoExt = {
    name: name as string,
    address,
    networkAddress: address,
    isExternal: isExternal,
  };

  const onSubmit = async (password: string) => {
    try {
      if (!name || (await keyring.existsName(name as string))) {
        triggerEvent(EventName.OpenRenameAccountDialog);
      }
      await keyring.importAccount(password, backup);
      onClose();
    } catch (e: any) {}
  };

  return (
    <div className=''>
      <AccountCard account={accountInfo} />
      <div className='mb-2 mt-4'>Enter password to continue</div>
      <PasswordPromptForm onSubmit={onSubmit} onBack={resetBackup} />
    </div>
  );
}

export default TransferAccountBackup;
