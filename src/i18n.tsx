import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enCommon from './locales/en/common.json';
import zhCNCommon from './locales/zh_CN/common.json';
import zhHKCommon from './locales/zh_HK/common.json';
import jaCommon from './locales/ja/common.json';
import koCommon from './locales/ko/common.json';
import frCommon from './locales/fr/common.json';
import esCommon from './locales/es/common.json';
import idCommon from './locales/id/common.json';
import ptCommon from './locales/pt/common.json';
import ruCommon from './locales/ru/common.json';
import thCommon from './locales/th/common.json';
import viCommon from './locales/vi/common.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { common: enCommon },
            zh_CN: { common: zhCNCommon },
            zh_HK: { common: zhHKCommon },
            ja: { common: jaCommon },
            ko: { common: koCommon },
            fr: { common: frCommon },
            es: { common: esCommon },
            id: { common: idCommon },
            pt: { common: ptCommon },
            ru: { common: ruCommon },
            th: { common: thCommon },
            vi: { common: viCommon },
        },
        lng: 'en',
        fallbackLng: 'en',
        debug: process.env.NODE_ENV === 'development',
        interpolation: {
            escapeValue: false,
        },
        defaultNS: 'common',
    });

export default i18n; 