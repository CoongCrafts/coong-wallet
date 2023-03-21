import { FC, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { useSelector } from 'react-redux';
import i18next from 'i18n';
import { changeLanguage } from 'i18next';
import { RootState } from 'redux/store';
import { Props } from 'types';

const LanguageProvider: FC<Props> = ({ children }) => {
  const { language } = useSelector((state: RootState) => state.settings);

  useEffect(() => {
    changeLanguage(language);
  }, [language]);

  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
};

export default LanguageProvider;
