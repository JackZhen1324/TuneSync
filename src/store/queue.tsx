import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type QueueStore = {
	activeQueueId: string
	setActiveQueueId: (id: string) => void
	queueListWithContent: any
	setQueueListContent: any
}

export const useQueueStore = create<QueueStore>()(
	persist(
		(set) => ({
			activeQueueId: 'default',
			queueListWithContent: {
				default: [],
			},
			setActiveQueueId: (id) => set({ activeQueueId: id }),
			setQueueListContent: (content: any, id: string, queueListWithContent: any) => {
				const activeQueueId = id || ''
				queueListWithContent[activeQueueId] = content
				set({
					queueListWithContent: queueListWithContent,
				})
			},
		}),
		{
			name: 'queueInfo', // 存储在 AsyncStorage 中的键名
			storage: {
				getItem: async (name) => {
					const value = await AsyncStorage.getItem(name)
					return value ? JSON.parse(value) : null
				},
				setItem: (name, value) => AsyncStorage.setItem(name, JSON.stringify(value)),
				removeItem: (name) => AsyncStorage.removeItem(name),
			},
		},
	),
)

export const useQueue = () => useQueueStore((state) => state)
