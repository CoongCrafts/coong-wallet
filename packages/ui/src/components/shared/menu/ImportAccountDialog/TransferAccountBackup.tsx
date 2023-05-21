import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useAsync, useToggle } from 'react-use';
import { AccountBackup } from '@coong/keyring/types';
import { Alert, Button, CircularProgress, InputAdornment, TextField } from '@mui/material';
import AccountCard from 'components/pages/Accounts/AccountCard';
import EmptySpace from 'components/shared/misc/EmptySpace';
import useAccountNameValidation from 'hooks/useAccountNameValidation';
import { useWalletState } from 'providers/WalletStateProvider';
import { AccountInfoExt, Props } from 'types';

export enum Conflict {
  AccountExisted = 'Account is already exists in your wallet. Importing account can not be implemented.',
  AccountNameExisted = 'Account name has already been taken. Please choose another name to continue importing.',
  AccountNameRequired = 'Account name is required. Please choose one to continue importing.',
}

interface ConflictAlertProps extends Props {
  conflict: Conflict | undefined;
}

function ConflictAlert({ conflict }: ConflictAlertProps): JSX.Element {
  const { t } = useTranslation();

  switch (conflict) {
    case Conflict.AccountExisted:
      return <Alert severity='error'>{t<string>(conflict)}</Alert>;
    case Conflict.AccountNameExisted:
    case Conflict.AccountNameRequired:
      return <Alert severity='info'>{t<string>(conflict)}</Alert>;
    default:
      return <></>;
  }
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
  const [conflict, setConflict] = useState<Conflict>();
  const [accountName, setAccountName] = useState<string>('');
  const [onImporting, setOnImporting] = useToggle(false);
  const { validation, loading } = useAccountNameValidation(accountName);
  const [password, setPassword] = useState<string>('');

  useAsync(async () => {
    if (await keyring.existsAccount(backup.address)) {
      setConflict(Conflict.AccountExisted);
    } else if (await keyring.existsName(meta.name as string)) {
      setConflict(Conflict.AccountNameExisted);
    } else if (!meta.name) {
      setConflict(Conflict.AccountNameRequired);
    } else setConflict(undefined);
  }, [backup]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setOnImporting(true);
    setTimeout(async () => {
      try {
        await keyring.importAccount(backup, password, accountName);
        onClose();
        toast.success('Import account successfully');
      } catch (e: any) {
        toast.error(t<string>(e.message));
      }
      setOnImporting(false);
    }, 200);
  };

  const account: AccountInfoExt = {
    name: meta.name as string,
    address: backup.address,
    networkAddress: backup.address,
    isExternal: !meta.originalHash || keyring.isExternal(meta.originalHash as string),
  };

  return (
    <div className=''>
      <AccountCard account={account} />
      <ConflictAlert conflict={conflict} />
      <form onSubmit={onSubmit} className='flex flex-col gap-2 mt-4'>
        {(conflict === Conflict.AccountNameExisted || conflict === Conflict.AccountNameRequired) && (
          <TextField
            value={accountName}
            onChange={(e) => setAccountName(e.currentTarget.value)}
            fullWidth
            label={t<string>('New account name')}
            autoFocus
            error={!!validation}
            helperText={validation || <EmptySpace />}
            InputProps={{
              endAdornment: <InputAdornment position='end'>{loading && <CircularProgress size={20} />}</InputAdornment>,
            }}
          />
        )}
        <TextField
          type='password'
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          fullWidth
          label={t<string>('Wallet password of the account backup')}
          autoFocus
        />
        <div className='mt-4 flex gap-2'>
          <Button onClick={resetBackup} variant='text'>
            {t<string>('Back')}
          </Button>
          <Button
            type='submit'
            disabled={!password || !!validation || (!!conflict && !accountName) || onImporting}
            fullWidth>
            {t<string>('Continue')}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default TransferAccountBackup;
