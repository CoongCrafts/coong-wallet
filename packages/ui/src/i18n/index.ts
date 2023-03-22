import { initReactI18next } from 'react-i18next';
import i18next from 'i18next';
import Backend from 'i18next-http-backend';

i18next
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    returnEmptyString: false,
    react: {
      useSuspense: false,
    },
  });

export default i18next;
