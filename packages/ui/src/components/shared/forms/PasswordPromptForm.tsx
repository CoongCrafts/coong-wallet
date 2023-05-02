import { ChangeEvent, FC, FormEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useEffectOnce, useToggle } from 'react-use';
import { Button, TextField } from '@mui/material';
import { Props } from 'types';

interface PasswordPromptFormProps extends Props {
  onSubmit: (password: string) => void;
  onBack: () => void;
  backButtonLabel?: string;
  continueButtonLabel?: string;
}

const PasswordPromptForm: FC<PasswordPromptFormProps> = ({
  onSubmit,
  onBack,
  backButtonLabel = 'Back',
  continueButtonLabel = 'Continue',
}) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useToggle(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffectOnce(() => {
    passwordInputRef.current?.focus();
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  };

  const doSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!password) {
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      try {
        await onSubmit(password);
      } catch (e: any) {
        setLoading(false);
        toast.error(t<string>(e.message));
      }
    }, 200);
  };

  return (
    <form onSubmit={doSubmit} noValidate className='flex flex-col gap-8'>
      <TextField
        inputRef={passwordInputRef}
        type='password'
        value={password}
        label={t<string>('Wallet password')}
        fullWidth
        onChange={handleChange}
      />

      <div className='flex gap-4'>
        <Button variant='text' onClick={onBack} disabled={loading}>
          {t<string>(backButtonLabel)}
        </Button>
        <Button type='submit' disabled={!password || loading} fullWidth variant='contained'>
          {t<string>(continueButtonLabel)}
        </Button>
      </div>
    </form>
  );
};

export default PasswordPromptForm;
