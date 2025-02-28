import { fetchMetadata } from '@/helpers/metadata'
import { useActiveTrack, useLibraryStore } from '@/store/library'
import { useTaskStore } from '@/store/task'
import { useCallback, useRef } from 'react'
import TrackPlayer from 'react-native-track-player'
// import { asyncPool } from '@/utils/asyncPool' // 你可以把 asyncPool 单独封装一个工具文件
import { debounce } from '@/helpers/debounce'
import { useMiddleware } from '@/store/middleware'
import { useTrackPlayerQueue } from './useTrackPlayerQueue'
export const asyncPool = async (
	poolLimit: number,
	array: any[],
	iteratorFn: (el: any, i?: number) => Promise<void>,
) => {
	const ret = [] // 用来存储所有任务对应的 Promise
	const executing: any[] = [] // 用来存储当前正在执行的任务（Promise）
	for (const item of array) {
		// 使用 Promise.resolve().then(...) 是为了保证 iteratorFn 返回的是一个 promise
		const p = Promise.resolve().then(() => iteratorFn(item))
		ret.push(p)

		// 并发数判断：如果并发上限 <= 数据长度，则执行下面的并发控制逻辑
		if (poolLimit <= array.length) {
			// e 表示 p 的一个包装 Promise，用于在任务完成后将其从 executing 中移除
			const e = p.then(() => {
				executing.splice(executing.indexOf(e), 1)
			})
			// 将 e 加入并发执行队列
			executing.push(e)

			// 如果当前执行中的任务数量达到了并发上限，则等待其中任意一个 Promise 完成（Promise.race）
			if (executing.length >= poolLimit) {
				await Promise.race(executing)
			}
		}
	}
	// 当所有的任务都被调度后，等待它们全部 settle（无论成功或失败）
	return Promise.allSettled(ret)
}
let updates: Array<{ title: string; url: string; pendingMeta?: boolean }> = []

export function useResumeMetadataExtraction() {
	const BATCH_SIZE = 1
	const {
		scrapingTaskQueue: taskQueue,
		running,
		removeTask,
		createLog,
		setTaskQueue,
	} = useTaskStore()

	const { update } = useTrackPlayerQueue()
	const { batchUpdate, tracks } = useLibraryStore()
	const { setActiveTrack } = useActiveTrack()
	const { middlewareConfigs } = useMiddleware()

	// 防止重复执行的标志
	const isBusy = useRef(false)
	const refreshMetadata = () => {
		setTaskQueue({
			type: 'scraping',
			body: tracks,
		})
		resumeMetadataExtraction()
	}

	// 真正执行扫描、获取元数据的函数
	const resumeMetadataExtraction = useCallback(
		debounce(async () => {
			console.log('resumeMetadataExtraction', taskQueue.length)

			// Clear updates array before starting
			updates = []
			isBusy.current = true
			// Use asyncPool to limit concurrency
			await asyncPool(5, taskQueue, async (el) => {
				const { title, artist } = el

				try {
					// skip metadata fetching if it's already in the queue
					if (!artist) {
						const meta = await fetchMetadata({ title, webdavUrl: el.url, middlewareConfigs })
						meta.title = title
						// if (!signal.aborted) {
						updates.push(meta)
						if (updates.length % BATCH_SIZE === 0) {
							batchUpdate(updates)
							update(updates)
							updates = []
						}

						removeTask({
							type: 'scraping',
							body: el,
						})
						createLog({
							type: 'success',
							body: `${el.title} success`,
						})
						const currentSong = await TrackPlayer.getActiveTrack()
						if (currentSong && currentSong.basename === el.title) {
							setActiveTrack(meta)
						}
					} else {
						removeTask({
							type: 'scraping',
							body: el,
						})
						createLog({
							type: 'warning',
							body: `Cache hitting, skip ${el.title} scraping!`,
						})
					}
					// Fetch metadata

					// }
				} catch (error) {
					createLog({
						type: 'error',
						body: `Error fetching metadata for ${title}, ${error}`,
					})
					removeTask({ type: 'scraping', body: el })
					console.error(`Error fetching metadata for ${title},  ${error}`)
				}
			})

			// Process any remaining updates
			if (updates.length > 0) {
				batchUpdate(updates)
				update(updates)
			}
		}, 200),
		[batchUpdate, createLog, middlewareConfigs, removeTask, setActiveTrack, taskQueue, update],
	)

	// 当 taskQueue 有变化且没有在执行的时候，自动执行一次

	// 也可以手动暴露出这个函数，随时在组件里调用
	return {
		refreshMetadata,
		resumeMetadataExtraction,
		isBusy,
	}
}
