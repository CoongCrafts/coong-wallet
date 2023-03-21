import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { changeLanguage } from 'i18next';
import { RootState } from 'redux/store';

export default function useChangeLanguage() {
  const { language } = useSelector((state: RootState) => state.settings);

  useEffect(() => {
    changeLanguage(language);
  }, [language]);
}
