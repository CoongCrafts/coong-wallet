import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAsync } from 'react-use';
import { AccountBackup } from '@coong/keyring/types';
import { useWalletState } from 'providers/WalletStateProvider';

enum Conflict {
  AccountExisted = 'Account has already existed.',
  AccountNameExisted = 'Account name ({{name}}) has already been taken. Please choose another name to continue.',
  AccountNameNotFound = 'Account name is required. Please choose a name to continue.',
  AccountNameLong = 'Account name ({{name}}) is too long. Please choose another name to continue (max 16 characters).',
}

function isResolvable(conflict: Conflict | undefined) {
  return (
    conflict === Conflict.AccountNameNotFound ||
    conflict === Conflict.AccountNameExisted ||
    conflict === Conflict.AccountNameLong
  );
}

export default function useAccountBackupValidation(backup: AccountBackup) {
  const { keyring } = useWalletState();
  const [conflict, setConflict] = useState<Conflict>();

  useAsync(async () => {
    const { address, meta } = backup;
    const name = (meta?.name ?? '') as string;

    if (await keyring.existsAccount(address)) {
      setConflict(Conflict.AccountExisted);
    } else if (!name) {
      setConflict(Conflict.AccountNameNotFound);
    } else if (name.length > 16) {
      setConflict(Conflict.AccountNameLong);
    } else if (await keyring.existsName(name)) {
      setConflict(Conflict.AccountNameExisted);
    } else {
      setConflict(undefined);
    }
  }, [backup]);

  const resolvable = isResolvable(conflict);

  return { conflict, resolvable };
}
