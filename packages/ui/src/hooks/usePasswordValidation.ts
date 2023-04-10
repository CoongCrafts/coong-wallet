import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function usePasswordValidation() {
  const [validation, setValidation] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { t } = useTranslation();

  useEffect(() => {
    // TODO Add more strict password policy & password strength indicator
    if (password && password.length <= 5) {
      setValidation(t<string>("Password's too short"));
    } else {
      setValidation('');
    }
  }, [password]);

  return { password, validation, setPassword, setValidation };
}
