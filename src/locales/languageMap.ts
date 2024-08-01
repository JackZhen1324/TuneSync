// types.ts
export const languageMap = {
	zh: '中文',
	en: 'English',
	ja: '日本語',
	ko: '한국어',
} as const

export type LanguageCode = keyof typeof languageMap
export type LanguageLabel = (typeof languageMap)[LanguageCode]
