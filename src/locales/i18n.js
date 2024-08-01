import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as RNLocalize from 'react-native-localize'
import en from './en.json'
import ja from './ja.json' // 日语
import ko from './ko.json' // 韩语
import zh from './zh.json'

const resources = {
	en: {
		translation: en,
	},
	zh: {
		translation: zh,
	},
	ko: {
		translation: ko,
	},
	ja: {
		translation: ja,
	},
}

const languageDetector = {
	type: 'languageDetector',
	async: true,
	detect: (callback) => {
		const locales = RNLocalize.getLocales()
		callback(locales[0].languageTag)
	},
	init: () => {},
	cacheUserLanguage: () => {},
}

i18n
	.use(languageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: 'en',
		interpolation: {
			escapeValue: false,
		},
	})

export default i18n
