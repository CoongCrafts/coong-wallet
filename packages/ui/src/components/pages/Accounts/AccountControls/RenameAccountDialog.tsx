import { ChangeEvent, FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Button, Dialog, DialogContent, DialogContentText, TextField } from '@mui/material';
import DialogTitle from 'components/shared/DialogTitle';
import EmptySpace from 'components/shared/misc/EmptySpace';
import useAccountNameValidation from 'hooks/useAccountNameValidation';
import useDialog from 'hooks/useDialog';
import useRegisterEvent from 'hooks/useRegisterEvent';
import { useWalletState } from 'providers/WalletStateProvider';
import { AccountInfoExt } from 'types';
import { EventName } from 'utils/eventemitter';

export default function RenameAccountDialog(): JSX.Element {
  const { keyring } = useWalletState();
  const { t } = useTranslation();
  const { open, doOpen, doClose } = useDialog();
  const [name, setName] = useState<string>('');
  const [account, setAccount] = useState<AccountInfoExt>();
  const { validation } = useAccountNameValidation(name, account?.name);

  const onOpen = (account: AccountInfoExt) => {
    setAccount(account);
    setName(account.name!);
    doOpen();
  };

  useRegisterEvent(EventName.OpenRenameAccountDialog, onOpen);

  const onClose = () => {
    doClose(() => setAccount(undefined));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
  };

  const doRename = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await keyring.renameAccount(account!.address, name);
      onClose();
      toast.success(t<string>('Account renamed'));
    } catch (e: any) {
      toast.error(t<string>(e.message));
    }
  };

  if (!account) return <></>;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle onClose={onClose}>{t<string>('Rename account')}</DialogTitle>
      <DialogContent>
        <DialogContentText className='mb-4'>{t<string>('Choose a new name for your account')}</DialogContentText>
        <form onSubmit={doRename} noValidate>
          <TextField
            value={name}
            onChange={handleChange}
            label={t<string>('Account name')}
            autoFocus
            fullWidth
            error={!!validation}
            helperText={validation || <EmptySpace />}
          />
          <div className='flex gap-4 mt-2'>
            <Button onClick={onClose} variant='text'>
              {t<string>('Cancel')}
            </Button>
            <Button type='submit' disabled={!name || !!validation || account.name === name} fullWidth>
              {t<string>('Rename')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
