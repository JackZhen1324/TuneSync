/*
 * @Author: zhen qian xhdp123@126.com
 * @Date: 2025-02-20 15:32:13
 * @LastEditors: zhen qian xhdp123@126.com
 * @LastEditTime: 2025-03-03 17:17:35
 * @FilePath: /TuneSync/src/hooks/useMetadataExtration.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { fetchMetadata } from '@/helpers/metadata'
import { useActiveTrack, useLibraryStore } from '@/store/library'
import { useTaskStore } from '@/store/task'
import { useEffect, useRef } from 'react'
import TrackPlayer from 'react-native-track-player'
// import { asyncPool } from '@/utils/asyncPool' // 你可以把 asyncPool 单独封装一个工具文件
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
	const abortControllerRef = useRef<AbortController | null>(null) // 用于存储 AbortController 实例
	const BATCH_SIZE = 50
	const { scrapingTaskQueue: taskQueue, removeTask, setTaskQueue } = useTaskStore()

	const { update } = useTrackPlayerQueue()
	const { batchUpdate, tracks } = useLibraryStore()
	const { setActiveTrack } = useActiveTrack()
	const { middlewareConfigs } = useMiddleware()
	useEffect(() => {
		useTaskStore.subscribe(
			(state) => state.dropTaskSignal,
			() => {
				abortControllerRef.current?.abort()
			},
		)
	}, [])
	const refreshMetadata = () => {
		setTaskQueue({
			type: 'scraping',
			body: tracks,
		})
		resumeMetadataExtraction(tracks)
	}

	// 真正执行扫描、获取元数据的函数
	const resumeMetadataExtraction = async (queue = taskQueue) => {
		let tasksQueue
		if (queue) {
			tasksQueue = queue
		} else {
			tasksQueue = taskQueue
		}
		console.log('tasksQueue', tasksQueue.length, queue.length)

		// 取消之前的任务
		if (abortControllerRef.current) {
			abortControllerRef.current.abort()
		}

		// 创建新的 AbortController
		abortControllerRef.current = new AbortController()
		const { signal } = abortControllerRef.current
		updates = []
		if (signal.aborted) return

		await asyncPool(5, tasksQueue, async (el) => {
			if (signal.aborted) return
			const { title, artist } = el

			try {
				if (!artist) {
					const meta = await fetchMetadata({ title, webdavUrl: el.url, middlewareConfigs, signal })
					meta.title = title
					updates.push(meta)

					if (updates.length % BATCH_SIZE === 0) {
						batchUpdate(updates)
						update(updates)
						updates = []
					}
					removeTask({ type: 'scraping', body: el })

					const currentSong = await TrackPlayer.getActiveTrack()
					if (currentSong && currentSong.basename === el.title) {
						setActiveTrack(meta)
					}
				} else {
					removeTask({ type: 'scraping', body: el })
				}
			} catch (error) {
				removeTask({ type: 'scraping', body: el })
				console.error(`Error fetching metadata for ${title}, ${error}`)
			}
		})

		if (updates.length > 0) {
			batchUpdate(updates)
			update(updates)
		}
	}

	// 当 taskQueue 有变化且没有在执行的时候，自动执行一次

	// 也可以手动暴露出这个函数，随时在组件里调用
	return {
		refreshMetadata,
		resumeMetadataExtraction,
	}
}
