import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { storage } from './mkkv'

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
			updateQueue: (id: string, content: any, setActiveTrack: any) => {
				return set((state) => {
					const queue = state?.queueListWithContent
					const targetIndex = queue['default'].findIndex((el) => el.title === id)
					if (targetIndex > -1) {
						queue['default'][targetIndex] = content
						setActiveTrack(content)
						return {
							queueListWithContent: queue,
						}
					} else {
						return {}
					}
				})
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

export const useQueue = () => useQueueStore((state) => state)
