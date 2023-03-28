import { FC, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useAsync } from 'react-use';
import { i18n } from 'i18next';
import { changeLanguage } from 'i18next';
import { RootState } from 'redux/store';
import { Props } from 'types';

interface LanguageProviderProps extends Props {
  i18nInstance: i18n;
}

const LanguageProvider: FC<LanguageProviderProps> = ({ children, i18nInstance }) => {
  const { language } = useSelector((state: RootState) => state.settings);

  useAsync(async () => {
    await i18nInstance.changeLanguage(language);
  }, [language]);

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
};

export default LanguageProvider;
