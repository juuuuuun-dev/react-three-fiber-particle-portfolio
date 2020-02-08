import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enAbout from '../config/about/en.json';
import jpAbout from '../config/about/jp.json'

i18n.use(initReactI18next).init({
  debug: true,
  resources: {
    en: {
      translation: {
        about: enAbout
      },
    },
    jp: {
      translation: {
        about: jpAbout
      },
    }
  },
  lng: 'en',
  fallbackLng: false,
  returnEmptyString: false,
})

export default i18n;
