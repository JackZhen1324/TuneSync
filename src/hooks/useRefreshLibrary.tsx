import { useCallback } from 'react'
import TrackPlayer from 'react-native-track-player'

// 下面这些 import 根据你项目中实际路径调整
import { debounce } from '@/helpers/debounce'
import { indexingLocal } from '@/helpers/indexing/local'
import { indexingWebdav } from '@/helpers/indexing/webdav'
import { filterOuterPaths } from '@/helpers/utils'
import { useTrackPlayerQueue } from '@/hooks/useTrackPlayerQueue'
import { useActiveTrack, useIndexStore, useLibraryStore } from '@/store/library'
import { useQueueStore } from '@/store/queue'
import { useTaskStore } from '@/store/task'
import { useResumeMetadataExtraction } from './useMetadataExtration'

/**
 * 如果有全局 updates 数组，可以在此文件顶部声明一个临时变量，
 * 或者和 resumeMetadataExtraction 共享同一个。
 */
let updates: Array<{ title: string; url: string; pendingMeta?: boolean }> = []

export function useRefreshLibrary() {
	// 从各自 Store / Hooks 中获取需要的 state 或者 actions
	const { setLoading, indexingList } = useIndexStore()
	const { batchUpdate, setTracks, tracksMap } = useLibraryStore()
	const { resumeMetadataExtraction } = useResumeMetadataExtraction()
	const { activeTrack, setActiveTrack } = useActiveTrack()
	const { activeQueueId, queueListWithContent, setQueueListContent, setActiveQueueId } =
		useQueueStore()
	const { setTaskQueue, removeTask, createLog, dropOldTask } = useTaskStore()
	const { update } = useTrackPlayerQueue()

	// 这个 refresh 回调如果在你的 songs 里也需要，可以移入 Hook 一起复用
	const refresh = useCallback(() => {
		setTracks(tracksMap)
		setActiveQueueId(activeQueueId)
	}, [activeQueueId, setActiveQueueId, setTracks, tracksMap])
	const runWithCache = useCallback(async () => {
		dropOldTask()
		// console.log('runWithCache', runWithCache)
		// setTaskQueue({ type: 'scraping', body: [] })
		try {
			setLoading({ loading: true, percentage: 0, current: '' })
			const localIndexing = indexingList.filter((el: { from: string }) => el.from === 'local')
			const webdavIndexing = indexingList.filter((el: { from: string }) => el.from !== 'local')
			const start = performance.now()
			const localMusices = await indexingLocal(localIndexing)
			const webdavMusices = await indexingWebdav(webdavIndexing)
			refresh()
			setLoading({
				loading: false,
				percentage: 100,
				current: '',
			})
			const musicTotal = [...localMusices, ...webdavMusices].map((el) => {
				return {
					...el,
					...tracksMap[el.basename],
				}
			})

			const formatedMusicTotal = {} as any
			const songTitles = musicTotal?.map((el) => {
				const { title } = el
				el.pendingMeta = true
				formatedMusicTotal[title] = el
				return title
			})

			const filteredQueue = queueListWithContent[activeQueueId]
				?.map((el: { title: string }, index: number) => {
					return songTitles.includes(el.title) ? -1 : index
				})
				?.filter((el: number) => el > -1)
			if (!songTitles.includes(activeTrack)) {
				setActiveTrack(undefined)
			}

			setTracks(formatedMusicTotal)
			removeTask({
				type: 'scanning',
				body: [{}],
			})
			setQueueListContent(
				queueListWithContent[activeQueueId]?.filter(
					(_el: any, index: any) => !filteredQueue.includes(index),
				),
			)
			const end = performance.now()
			console.log('cost is', `${end - start}ms`)
			await TrackPlayer.remove(filteredQueue)

			updates = []
			setTaskQueue({
				type: 'scraping',
				body: musicTotal,
			})
			resumeMetadataExtraction(musicTotal)
			// Process any remaining updates
			if (updates.length > 0) {
				batchUpdate(updates)
				update(updates)
			}
			setLoading({ loading: false, percentage: 0, current: '' })
		} catch (error) {
			console.log('error', error)

			setLoading({ loading: false, percentage: 0, current: '' })
		}
	}, [
		activeQueueId,
		activeTrack,
		batchUpdate,
		dropOldTask,
		indexingList,
		queueListWithContent,
		refresh,
		removeTask,
		resumeMetadataExtraction,
		setActiveTrack,
		setLoading,
		setQueueListContent,
		setTaskQueue,
		setTracks,
		tracksMap,
		update,
	])
	/**
	 * refreshLibrary：执行从本地或 WebDAV 获取歌曲列表，并刷新全局 Store。
	 */
	const run = useCallback(async () => {
		dropOldTask()
		try {
			setLoading({ loading: true, percentage: 0, current: '' })
			const localIndexing = filterOuterPaths(
				indexingList.filter((el: { from: string }) => el.from === 'local'),
			)
			const webdavIndexing = filterOuterPaths(
				indexingList.filter((el: { from: string }) => el.from !== 'local'),
			)
			const start = performance.now()
			const localMusices = await indexingLocal(localIndexing)
			const webdavMusices = await indexingWebdav(webdavIndexing)
			refresh()
			setLoading({
				loading: false,
				percentage: 100,
				current: '',
			})
			const musicTotal = [...localMusices, ...webdavMusices]

			const formatedMusicTotal = {} as any
			const songTitles = musicTotal?.map((el) => {
				const { title } = el
				el.pendingMeta = true
				formatedMusicTotal[title] = el
				return title
			})

			const filteredQueue = queueListWithContent[activeQueueId]
				?.map((el: { title: string }, index: number) => {
					return songTitles.includes(el.title) ? -1 : index
				})
				?.filter((el: number) => el > -1)
			if (!songTitles.includes(activeTrack)) {
				setActiveTrack(undefined)
			}

			setTracks(formatedMusicTotal)
			removeTask({
				type: 'scanning',
				body: [{}],
			})

			setQueueListContent(
				queueListWithContent[activeQueueId]?.filter(
					(_el: any, index: any) => !filteredQueue.includes(index),
				),
			)
			const end = performance.now()
			console.log('cost is', `${end - start}ms`)
			await TrackPlayer.remove(filteredQueue)

			// Clear updates array before starting
			updates = []
			setTaskQueue({
				type: 'scraping',
				body: musicTotal,
			})

			resumeMetadataExtraction(musicTotal)
			// Process any remaining updates
			if (updates.length > 0) {
				batchUpdate(updates)
				update(updates)
			}
			setLoading({ loading: false, percentage: 0, current: '' })
		} catch (error) {
			console.log('error', error)

			setLoading({ loading: false, percentage: 0, current: '' })
		}
	}, [
		activeQueueId,
		activeTrack,
		batchUpdate,
		dropOldTask,
		indexingList,
		queueListWithContent,
		refresh,
		removeTask,
		resumeMetadataExtraction,
		setActiveTrack,
		setLoading,
		setQueueListContent,
		setTaskQueue,
		setTracks,
		update,
	])

	const refreshLibrary = debounce(() => {
		setTaskQueue({
			type: 'scanning',
			body: [{ type: 'all' }],
		})

		run()
	}, 100)
	const refreshLibraryWithCache = debounce(() => {
		setTaskQueue({
			type: 'scanning',
			body: [{ type: 'partial' }],
		})

		runWithCache()
	}, 5000)
	const refreshLibraryWithCacheWithoutDebounce = () => {
		setTaskQueue({
			type: 'scanning',
			body: [{ type: 'partial' }],
		})

		runWithCache()
	}
	return {
		refreshLibrary,
		refreshLibraryWithCache,
		refreshLibraryWithCacheWithoutDebounce,
	}
}
