import { FormEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useAsync, useToggle } from 'react-use';
import { AccountBackup } from '@coong/keyring/types';
import { Alert, Button, TextField } from '@mui/material';
import AccountCard from 'components/pages/Accounts/AccountCard';
import LoadingTextField from 'components/shared/LoadingTextField';
import EmptySpace from 'components/shared/misc/EmptySpace';
import useHighlightNewAccount from 'hooks/accounts/useHighlightNewAccount';
import useAccountNameValidation from 'hooks/useAccountNameValidation';
import { useWalletState } from 'providers/WalletStateProvider';
import { AccountInfoExt, Props } from 'types';

export enum Conflict {
  AccountExisted = 'Account is already exists in your wallet. Importing account can not be implemented.',
  AccountNameExisted = 'Account name has already been taken. Please choose another name to continue importing.',
  AccountNameNotFound = 'Account name is required. Please choose one to continue importing.',
  AccountNameLong = 'Account name is too long. Please choose another name not exceed 16 characters to continue.',
}

function isResolvable(conflict: Conflict | undefined) {
  return (
    conflict === Conflict.AccountNameNotFound ||
    conflict === Conflict.AccountNameExisted ||
    conflict === Conflict.AccountNameLong
  );
}

interface TransferAccountBackupProps extends Props {
  backup: AccountBackup;
  onClose: () => void;
  resetBackup: () => void;
}

function TransferAccountBackup({ backup, resetBackup, onClose }: TransferAccountBackupProps): JSX.Element {
  const { keyring } = useWalletState();
  const { meta } = backup;
  const { t } = useTranslation();
  const [onImporting, setOnImporting] = useToggle(false);
  const [conflict, setConflict] = useState<Conflict>();
  const [newName, setNewName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { validation, loading } = useAccountNameValidation(newName);
  const { setNewAccount } = useHighlightNewAccount();

  const accountInfo = useMemo(
    (): AccountInfoExt => ({
      name: meta.name as string,
      address: backup.address,
      networkAddress: backup.address,
      isExternal: !meta.originalHash || keyring.isExternal(meta.originalHash as string),
    }),
    [],
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
  }, [backup]);

  const doImportAccount = (event: FormEvent) => {
    event.preventDefault();

    setOnImporting(true);
    setTimeout(async () => {
      try {
        const account = await keyring.importAccount(backup, password, newName);
        onClose();
        toast.success(t<string>('Import account successfully'));
        setNewAccount(account);
      } catch (e: any) {
        setOnImporting(false);
        toast.error(t<string>(e.message));
      }
    }, 200);
  };

  return (
    <div>
      <AccountCard account={accountInfo} />
      {conflict && (
        <Alert severity={isResolvable(conflict) ? 'info' : 'error'} className='my-4'>
          {t<string>(conflict)}
        </Alert>
      )}
      <form onSubmit={doImportAccount}>
        {isResolvable(conflict) && (
          <LoadingTextField
            value={newName}
            onChange={(e) => setNewName(e.currentTarget.value)}
            loading={loading}
            fullWidth
            label={t<string>('New account name')}
            autoFocus
            error={!!validation}
            helperText={validation || <EmptySpace />}
          />
        )}
        <TextField
          type='password'
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          fullWidth
          label={t<string>('Wallet password of the account backup')}
          autoFocus
          className='mt-4'
          disabled={conflict && !isResolvable(conflict)}
        />
        <div className='mt-6 flex gap-2'>
          <Button onClick={resetBackup} variant='text'>
            {t<string>('Back')}
          </Button>
          <Button
            type='submit'
            disabled={!password || !!validation || (!!conflict && !newName) || onImporting}
            fullWidth>
            {t<string>('Import Account')}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default TransferAccountBackup;
