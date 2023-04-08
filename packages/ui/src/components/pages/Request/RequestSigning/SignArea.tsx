import { FC, FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useToggle } from 'react-use';
import { Button, TextField } from '@mui/material';
import { Props } from 'types';

interface SignAreaProps extends Props {
  onSign: (password: string) => void;
  onCancel: () => void;
  cancelButtonLabel?: string;
  signButtonLabel?: string;
}

const SignArea: FC<SignAreaProps> = ({ onSign, onCancel, cancelButtonLabel = 'Cancel', signButtonLabel = 'Sign' }) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState<string>('');
  const [loading, toggleLoading] = useToggle(false);

  const doSign = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toggleLoading(true);

    // signing & accounts decryption are synchronous operations
    // and might take some time to do
    // so we delay it a short amount of time to make sure the UI could be updated (disable button, ...)
    // before the signing process begin
    // TODO: Moving CPU-intensive operations to worker
    setTimeout(async () => {
      try {
        await onSign(password);
      } catch (e: any) {
        toggleLoading(false);
        toast.error(t<string>(e.message));
      }
    }, 200);
  };

  return (
    <Form className='mt-8' onSubmit={doSign}>
      <TextField
        label={t<string>('Wallet password')}
        size='medium'
        type='password'
        fullWidth
        autoFocus
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <div className='flex mt-4 gap-4'>
        <Button size='large' variant='text' className='xs:w-2/5' color='warning' onClick={onCancel}>
          {t<string>(cancelButtonLabel)}
        </Button>
        <Button size='large' className='w-full xs:w-3/5' disabled={!password || loading} type='submit'>
          {t<string>(signButtonLabel)}
        </Button>
      </div>
    </Form>
  );
};

export default SignArea;
