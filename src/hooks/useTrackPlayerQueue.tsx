import { getCachedTrack, reCached } from '@/helpers/cache'
import { useQueueStore } from '@/store/queue'
import { useCallback, useEffect, useState } from 'react'
import RNFS from 'react-native-fs'
import TrackPlayer, { Event, Track, TrackMetadataBase } from 'react-native-track-player'

/**
 * useTrackPlayerQueue Hook
 * 获取 TrackPlayer 当前的队列并在队列变化时更新
 */
export const useTrackPlayerQueue = () => {
	const [queue, setQueue] = useState<Track[]>([])

	const { setQueueListContent } = useQueueStore((state) => state)

	const remove = async (item: number) => {
		await TrackPlayer.remove(item)
		const currentQueue = await updateQueue()
		return currentQueue
	}

	const updateQueue = useCallback(async () => {
		const currentQueue = await TrackPlayer.getQueue()

		setQueue(currentQueue)
		setQueueListContent(currentQueue)
		return currentQueue
	}, [setQueueListContent])
	const update = useCallback(
		async (items: TrackMetadataBase[]) => {
			const currentQueue = await TrackPlayer.getQueue()
			items.map(async (item: TrackMetadataBase) => {
				const targetIndex = currentQueue.findIndex((el) => el.title === item.title)

				if (targetIndex > -1) {
					await TrackPlayer.updateMetadataForTrack(targetIndex, item)
					await updateQueue()
				} else {
					return
				}
			})
		},
		[updateQueue],
	)
	const skip = async (index, track) => {
		const cachePath = track?.cachedUrl || ''
		const cacheDir = track?.cache_dir || ''
		const fileExists = await RNFS.exists(cachePath)
		const cacheNotExpired = await RNFS.exists(cacheDir)
		// project rebuild
		if (!cacheNotExpired) {
			track.url = track.originalUrl
			await TrackPlayer.reset()
			await addTrackToPlayer(track)
			await TrackPlayer.skip(0)
		}
		// cache hit
		else if (fileExists) {
			await TrackPlayer.skip(index)
		} else {
			await reCached(track.originalUrl, track.basename, track.cachedUrl)
			await TrackPlayer.skip(index)
		}
	}
	const addTrackToPlayer = async (track: Track): Promise<void> => {
		const { url, from, basename, id } = track
		let trackUrl
		let cache_dir
		if (from === 'local') {
			trackUrl = url
		} else {
			const { filePath, CACHE_DIR } = await getCachedTrack(url, basename || id)
			cache_dir = CACHE_DIR
			trackUrl = filePath
		}

		const trackToAdd = {
			...track,
			originalUrl: track.url,
			cachedUrl: trackUrl || '',
			url: trackUrl || '',
			cache_dir: cache_dir,
		}

		await TrackPlayer.add(trackToAdd)
	}
	useEffect(() => {
		// 初始化获取队列
		updateQueue()

		// 定义事件监听回调函数
		const onTrackChange = async () => {
			await updateQueue()
		}

		// 根据你的需求选择合适的事件：
		// playback-track-changed：当播放中的曲目变化时触发
		// playback-queue-ended：当队列播放结束时触发
		// 你也可以监听其他事件以满足你的需求

		const trackChangedSub = TrackPlayer.addEventListener(Event.PlaybackState, onTrackChange)

		// 可以添加更多事件监听，如队列结束
		// const queueEndedSub = TrackPlayer.addEventListener(
		//   Event.PlaybackQueueEnded,
		//   onTrackChange
		// );

		return () => {
			trackChangedSub.remove()
			// queueEndedSub?.remove();
		}
	}, [updateQueue])

	return { queue, remove, update, addTrackToPlayer, skip }
}
