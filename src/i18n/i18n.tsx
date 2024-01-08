import ru_RU from './localizations/ru_RU.json';
import en_EN from './localizations/en_EN.json';
import ch_CH from './localizations/ch_CH.json';

export type l18nLocale = 'ru_RU' | 'en_EN' | 'ch_CH';

export type l18nType = {
    localization: typeof ru_RU | typeof en_EN | typeof ch_CH;
    currLocale: l18nLocale;
};

export function getL18nObject(key: l18nLocale): l18nType {
    let localizationFile: typeof ru_RU | typeof en_EN | typeof ch_CH;

    if (key === 'ru_RU') {
        localizationFile = ru_RU;
    } else if (key === 'en_EN') {
        localizationFile = en_EN;
    } else if (key === 'ch_CH') {
        localizationFile = ch_CH;
    }

    return {
        localization: localizationFile!,
        currLocale: key,
    };
}