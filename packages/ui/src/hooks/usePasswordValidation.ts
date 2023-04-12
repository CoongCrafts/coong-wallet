import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';

export default function usePasswordValidation(password: string) {
  const [validation, setValidation] = useState<string>('');
  const { verifiedPassword: oldPassword } = useSelector((state: RootState) => state.settingsDialog);
  const { t } = useTranslation();

  useEffect(() => {
    // TODO Add more strict password policy & password strength indicator
    if (password && password.length <= 5) {
      setValidation(t<string>("Password's too short"));
    } else if (!!oldPassword && password === oldPassword) {
      setValidation(t<string>('Please pick a different password than the previous one'));
    } else {
      setValidation('');
    }
  }, [password]);

  return { validation };
}
