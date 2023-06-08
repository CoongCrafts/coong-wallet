import { ChangeEvent, FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useToggle } from 'react-use';
import { AccountBackup } from '@coong/keyring/types';
import { Alert, Button, TextField } from '@mui/material';
import AccountCard from 'components/pages/Accounts/AccountCard';
import useAccountBackupValidation from 'components/shared/menu/ImportAccountDialog/useAccountBackupValidation';
import EmptySpace from 'components/shared/misc/EmptySpace';
import useHighlightNewAccount from 'hooks/accounts/useHighlightNewAccount';
import useAccountNameValidation from 'hooks/useAccountNameValidation';
import { useWalletState } from 'providers/WalletStateProvider';
import { Props } from 'types';

interface TransferAccountBackupProps extends Props {
  backup: AccountBackup;
  onClose: () => void;
  resetBackup: () => void;
}

function TransferAccountBackup({ backup, resetBackup, onClose }: TransferAccountBackupProps): JSX.Element {
  const { keyring } = useWalletState();
  const { t } = useTranslation();
  const [onImporting, setOnImporting] = useToggle(false);
  const [newName, setNewName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { validation } = useAccountNameValidation(newName);
  const { setNewAccount } = useHighlightNewAccount();
  const { conflict, resolvable, accountInfo } = useAccountBackupValidation(backup);

  const originalAccountBackupName = backup.meta.name as string;

  if (conflict && !resolvable)
    return (
      <div>
        <AccountCard account={accountInfo} />
        <Alert severity='error' className='mt-4'>
          {t<string>(conflict, { name: originalAccountBackupName })}
        </Alert>
        <Button onClick={resetBackup} className='mt-4' fullWidth>
          {t<string>('Back')}
        </Button>
      </div>
    );

  const doImportAccount = (event: FormEvent) => {
    event.preventDefault();

    setOnImporting(true);

    setTimeout(async () => {
      try {
        // To avoid change the content of original backup
        const cloneBackup: AccountBackup = { ...backup, meta: { ...backup.meta } };
        cloneBackup.meta.name = newName || originalAccountBackupName;

        const account = await keyring.importAccount(cloneBackup, password);
        onClose();
        toast.success(t<string>('Import account successfully'));
        setNewAccount(account);
      } catch (e: any) {
        setOnImporting(false);
        toast.error(t<string>(e.message));
      }
    }, 200);
  };

  const handleNewNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newName = e.currentTarget.value;
    setNewName(newName);

    // To display the preview with the new name
    // without altering the original backup name
    if (!newName) accountInfo.name = originalAccountBackupName;
    else accountInfo.name = newName;
  };

  return (
    <div>
      <AccountCard account={accountInfo} />
      {conflict && (
        <Alert severity='info' className='mt-4'>
          {t<string>(conflict, { name: originalAccountBackupName })}
        </Alert>
      )}
      <form onSubmit={doImportAccount} className='mt-4'>
        {resolvable && (
          <TextField
            value={newName}
            onChange={handleNewNameChange}
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
