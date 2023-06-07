import { useMemo, useState } from 'react';
import { useAsync } from 'react-use';
import { AccountBackup } from '@coong/keyring/types';
import { useWalletState } from 'providers/WalletStateProvider';
import { AccountInfoExt } from 'types';

export enum Conflict {
  AccountExisted = 'Account is already exists in your wallet. Importing account can not be implemented.',
  AccountNameExisted = 'Account name {{name}} has already been taken. Please choose another name to continue importing.',
  AccountNameNotFound = 'Account name {{name}} is required. Please choose one to continue importing.',
  AccountNameLong = 'Account name {{name}} is too long. Please choose another name not exceed 16 characters to continue.',
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

  const accountInfo = useMemo(
    (): AccountInfoExt => ({
      name: backup.meta.name as string,
      address: backup.address,
      networkAddress: backup.address,
      isExternal: keyring.isExternalAccount(backup.meta.originalHash as string),
    }),
    [backup],
  );

  useAsync(async () => {
    const accountExists = await keyring.existsAccount(accountInfo.address);

    if (accountExists) {
      setConflict(Conflict.AccountExisted);
    } else if (!accountInfo.name) {
      setConflict(Conflict.AccountNameNotFound);
    } else if (accountInfo.name.length > 16) {
      setConflict(Conflict.AccountNameLong);
    } else {
      const nameExists = await keyring.existsName(accountInfo.name!);

      if (nameExists) {
        setConflict(Conflict.AccountNameExisted);
      } else {
        setConflict(undefined);
      }
    }
  }, [accountInfo]);

  const resolvable = isResolvable(conflict);

  return { conflict, resolvable, accountInfo };
}
