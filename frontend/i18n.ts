const cookieObj = typeof window === 'undefined' ? require('next/headers') : require('universal-cookie');

import en from './public/locales/en.json';
import th from './public/locales/th.json';
const langObj: any = { en, th };

const getLang = () => {
    let lang = null;
    if (typeof window !== 'undefined') {
        //const cookies = new cookieObj.default(null, { path: '/' });
        const cookies = new cookieObj();
        lang = cookies.get('i18nextLng');
    } else {
        const cookies = cookieObj.cookies();
        lang = cookies.get('i18nextLng')?.value;
    }
    return lang;
};

export const getTranslation = () => {
    const lang = getLang();
    const data: any = langObj[lang || 'th'];

    const t = (key: string) => {
        return data[key] ? data[key] : key;
    };

    const initLocale = (themeLocale: string) => {
        const lang = getLang();
        i18n.changeLanguage(lang || themeLocale);
    };

    const i18n = {
        language: lang,
        changeLanguage: (lang: string) => {
            //const cookies = new cookieObj.default(null, { path: '/' });
            const cookies = new cookieObj();
            cookies.set('i18nextLng', lang);
        },
    };
    console.log(cookieObj);

    return { t, i18n, initLocale };
};
