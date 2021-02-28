import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enIndex from '../config/index/en';
import jaIndex from '../config/index/ja';
import enAbout from '../config/about/en';
import jaAbout from '../config/about/ja'
import enContact from '../config/contact/en';
import jaContact from '../config/contact/ja';
import enCookie from '../config/cookie/en';
import jaCookie from '../config/cookie/ja';

i18n.use(initReactI18next).init({
  debug: false,
  resources: {
    en: {
      translation: {
        index: enIndex,
        about: enAbout,
        contact: enContact,
        cookie: enCookie,
      },
    },
    ja: {
      translation: {
        index: jaIndex,
        about: jaAbout,
        contact: jaContact,
        cookie: jaCookie,
      },
    }
  },
  lng: 'en',
  fallbackLng: false,
  returnEmptyString: false,
})

export default i18n;
