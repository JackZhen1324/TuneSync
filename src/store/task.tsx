/*
 * @Author: Zhen Qian zqian15@asu.edu
 * @Date: 2025-02-20 01:46:34
 * @LastEditors: zhen qian xhdp123@126.com
 * @LastEditTime: 2025-03-03 17:17:16
 * @FilePath: /TuneSync/src/store/task.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// import library from '@/assets/data/library.json'
import { getFormatedDate } from '@/helpers/utils'
import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import { storage } from './mkkv'

interface TaskState {
	running?: {
		id: 'scraping' | 'scanning'
		name: 'scraping' | 'scanning'
		progress: string
		status: 'running' | 'starting'
	}
	logs: any
	resetTask: any
	scrapingTaskSize: number
	scanningTaskQueue: any[]
	scrapingTaskQueue: any[]
	historyTask: string[]
	dropTaskSignal: boolean
	dropOldTask: () => void
	resetLogs: () => void
	createLog: (data: { type: 'normal' | 'success' | 'warning' | 'error'; body: string }) => void
	removeTask: (data: { type: 'scanning' | 'scraping'; body: any }) => void
	setTaskQueue: ({ type, body }: { type: 'scanning' | 'scraping'; body: any[] }) => void
}

const timestamp = getFormatedDate()
export const useTaskStore = create<TaskState>()(
	persist(
		subscribeWithSelector((set) => ({
			logs: [],
			dropTaskSignal: false,
			running: undefined,
			scrapingTaskSize: 0,
			scanningTaskQueue: [],
			scrapingTaskQueue: [],
			historyTask: [],
			dropOldTask: () => {
				set((state) => {
					const { dropTaskSignal } = state
					return {
						dropTaskSignal: !dropTaskSignal,
					}
				})
			},
			resetTask: () => {
				set(() => {
					return {
						running: undefined,
					}
				})
			},
			resetLogs: () => {
				set(() => {
					return {
						logs: [],
					}
				})
			},
			createLog: (data) => {
				const timestamp = getFormatedDate()
				const { body } = data
				set((state) => {
					const { logs } = state

					const currentLog = {
						...data,
						body: `${timestamp}: ${body}`,
					}
					return {
						logs: [currentLog, ...logs],
					}
				})
			},
			removeTask: (data) => {
				const { type, body } = data

				set((state) => {
					const { scrapingTaskQueue } = state
					if (type === 'scanning') {
						return {
							scanningTaskQueue: [],
						}
					} else if (type === 'scraping') {
						const filteredTasks = scrapingTaskQueue.filter((el) => el.title !== body.title)

						const running = {
							id: type,
							name: type,
							progress: filteredTasks.length,
							status: 'running',
						}

						return {
							scrapingTaskQueue: filteredTasks,
							running: filteredTasks.length === 0 ? undefined : running,
						}
					}
				})
			},

			setTaskQueue: (data) => {
				set(() => {
					const { type, body } = data
					const log = `${type} task start`
					const running = {
						id: type,
						name: type,
						progress: `0`,
						status: 'starting',
					}

					if (type === 'scanning') {
						return {
							scanningTaskQueue: body,
							running: running,
						}
					} else if (type === 'scraping') {
						console.log('body', body.length)

						return {
							scrapingTaskQueue: body,
							scrapingTaskSize: body.length,
							running: running,
						}
					}
				})
			},
		})),
		{
			name: 'taskQueue', // 存储在 AsyncStorage 中的键名
			storage: {
				getItem: (name: string) => {
					const value = storage.getString(name)
					return value ? JSON.parse(value) : null
				},
				setItem: (name: string, value: any) => storage.set(name, JSON.stringify(value)),
				removeItem: (name: string) => storage.delete(name),
			},
		},
	),
)
