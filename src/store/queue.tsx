import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storage } from './mkkv';


interface Queue {
	title: string;
	// Add other properties as needed
}

interface QueueListWithContent {
	[key: string]: Queue[];
}

interface QueueStore {
	activeQueueId: string;
	setActiveQueueId: (id: string) => void;
	queueListWithContent: QueueListWithContent;
	setQueueListContent: (content: Queue[], id: string, queueListWithContent: QueueListWithContent) => void;
	batchUpdateQueue: any;
	updateQueue: (id: string, content: Partial<Queue>) => void;
}

export const useQueueStore = create<QueueStore>()(
	persist(
		(set) => ({
			activeQueueId: 'default',
			queueListWithContent: {
				default: [] as Queue[],
			},
			batchUpdateQueue: (data) => {
				set((state) => {
					const queue = JSON.parse(JSON.stringify(state?.queueListWithContent || { default: [] })) as QueueListWithContent;
					data.map((el) => {
						const id = el.title
						const targetIndex = queue['default'].findIndex((el) => el.title === id);
						queue['default'][targetIndex] = { ...queue['default'][targetIndex], ...el };
					});
					return {
						queueListWithContent: queue
					};
				});
			},
			updateQueue: (id: string, content: Partial<Queue>) => {
				return set((state) => {
					const queue = JSON.parse(JSON.stringify(state?.queueListWithContent || { default: [] })) as QueueListWithContent;

					const targetIndex = queue['default'].findIndex((el) => el.title === id);
					if (targetIndex > -1) {
						queue['default'][targetIndex] = { ...queue['default'][targetIndex], ...content };

						return {
							queueListWithContent: queue,
						};
					} else {
						return {};
					}
				});
			},
			setActiveQueueId: (id) => set({ activeQueueId: id }),
			setQueueListContent: (content: any, id: string, queueListWithContent: any) => {
				const activeQueueId = id || ''
				queueListWithContent[activeQueueId] = content
				set({
					queueListWithContent: queueListWithContent,
				});
			},
		}),
		{
			name: 'queueInfo', // 存储在 AsyncStorage 中的键名
			storage: {
				getItem: (name: string) => {
					const value = storage.getString(name);
					return value ? JSON.parse(value) : null;
				},
				setItem: (name: string, value: any) => storage.set(name, JSON.stringify(value)),
				removeItem: (name: string) => storage.delete(name),
			},
		},
	),
)

export const useQueue = () => useQueueStore((state) => state)
