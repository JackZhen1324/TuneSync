// import library from '@/assets/data/library.json'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { storage } from './mkkv'

interface languageState {
	language: string
	setLanguage: (language: string) => void
}

export const useLanguageStore = create<languageState>()(
	persist(
		(set) => {
			return {
				language: 'en',
				setLanguage: (lan) => set({ language: lan }),
			}
		},
		{
			name: 'language', // 存储在 AsyncStorage 中的键名
			storage: {
				getItem: (name) => {
					const value = storage.getString(name)
					return value ? JSON.parse(value) : null
				},
				setItem: (name, value) => storage.set(name, JSON.stringify(value)),
				removeItem: (name) => storage.delete(name),
			},
		},
	),
)
