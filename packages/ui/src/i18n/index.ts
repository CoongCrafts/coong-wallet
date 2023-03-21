import i18next from 'i18next';
import Backend from 'i18next-http-backend';

i18next.use(Backend).init({
  debug: true,
  fallbackLng: 'en',
  returnEmptyString: false,
  react: {
    useSuspense: false,
  },
});

export default i18next;
