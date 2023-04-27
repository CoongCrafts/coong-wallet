import { ChangeEvent, FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useEffectOnce } from 'react-use';
import { Button, Dialog, DialogContent, DialogContentText, TextField } from '@mui/material';
import DialogTitle from 'components/shared/DialogTitle';
import EmptySpace from 'components/shared/misc/EmptySpace';
import useDialog from 'hooks/useDialog';
import { useWalletState } from 'providers/WalletStateProvider';
import { AccountInfoExt, Props } from 'types';
import { EventName, EventRegistry } from 'utils/eventemitter';

export default function RenameAccountDialog({}: Props): JSX.Element {
  const { keyring } = useWalletState();
  const { t } = useTranslation();
  const { open, doOpen, doClose } = useDialog();
  const [name, setName] = useState<string>('');
  const [account, setAccount] = useState<AccountInfoExt>();

  const onOpen = (account: AccountInfoExt) => {
    setAccount(account);
    setName(account.name!);
    doOpen();
  };

  useEffectOnce(() => {
    EventRegistry.on(EventName.OpenRenameAccountDialog, onOpen);
    return () => {
      EventRegistry.off(EventName.OpenRemoveAccountDialog, onOpen);
    };
  });

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

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle onClose={onClose}>{t<string>('Rename account')}</DialogTitle>
      <DialogContent className='pb-8'>
        <DialogContentText className='mb-4'>{t<string>('Choose a new name for your account')}</DialogContentText>
        <form onSubmit={doRename} noValidate>
          <TextField
            value={name}
            onChange={handleChange}
            label='Account name'
            autoFocus
            fullWidth
            error={name.length >= 16}
            helperText={
              name.length >= 16 ? t<string>('Account name need to be less than 16 character') : <EmptySpace />
            }
          />
          <div className='flex justify-end gap-4 mt-2'>
            <Button onClick={onClose} variant='text'>
              {t<string>('Cancel')}
            </Button>
            <Button type='submit' disabled={!name || name.length >= 16}>
              {t<string>('Rename')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
