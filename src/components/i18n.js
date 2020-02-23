import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enAbout from '../config/about/en';
import jaAbout from '../config/about/ja'

i18n.use(initReactI18next).init({
  debug: false,
  resources: {
    en: {
      translation: {
        about: enAbout
      },
    },
    ja: {
      translation: {
        about: jaAbout
      },
    }
  },
  lng: 'en',
  fallbackLng: false,
  returnEmptyString: false,
})

export default i18n;
