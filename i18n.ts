import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './src/translations/en.json';
import fr from './src/translations/fr.json';
import es from './src/translations/es.json';
import yo from './src/translations/yo.json';
import fon from './src/translations/fon.json';
import gou from './src/translations/gou.json';

i18n
  .use(initReactI18next)
  .init({
    // compatibilityJSON: 'v2',
    lng: 'fr', // default language
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      es: { translation: es },
      yo: { translation: yo },
      fon: { translation: fon },
      gou: { translation: gou }
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
