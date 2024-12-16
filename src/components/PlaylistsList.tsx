import { unknownTrackImageUri } from '@/constants/images'
import { debounce } from '@/helpers/debounce'
import { useTrackPlayerQueue } from '@/hooks/useTrackPlayerQueue'
import { useActiveTrack } from '@/store/library'
import { useQueueStore } from '@/store/queue'
import { utilsStyles } from '@/styles'
import { router } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FlatList, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import TrackPlayer, { useActiveTrack as useActiveTrackAlternative } from 'react-native-track-player'
import { PlayListItem } from './PlaylistListItem'

const ItemDivider = () => (
	<View style={{ ...utilsStyles.itemSeparator, marginLeft: 80, marginVertical: 12 }} />
)

export const PlaylistsList = () => {
	const { activeQueueId, queueListWithContent } = useQueueStore((state) => state)
	const { queue, remove } = useTrackPlayerQueue()
	const [needUpdate, setNeedUpdate] = useState(false)
	const { setActiveTrack } = useActiveTrack((state) => state)
	const currentTrack = useActiveTrackAlternative()
	const [loadingTrackId, setLoadingTrackId] = useState<string | null>(currentTrack?.basename || '')
	const queueList = useMemo(
		() => queueListWithContent[activeQueueId] || [],
		[activeQueueId, queueListWithContent],
	)

	const onDelete = useCallback(
		async (item: { title: any }, index: number) => {
			// 尝试先更新UI状态，之后再异步处理实际的删除逻辑
			setNeedUpdate(true)
			const resQueue = await remove(index || 0)

			if (resQueue.length < 1) {
				TrackPlayer.reset()
				setActiveTrack(undefined)
				router.back()
				return
			}

			// 如果当前删除的曲目是正在播放的曲目则保持播放状态
			if (currentTrack?.basename === item.title) {
				TrackPlayer.play()
			}
		},
		[currentTrack?.basename, remove, setActiveTrack],
	)

	// debounce后在后台同步队列删除数据，不阻塞UI
	useEffect(() => {
		const sync = debounce(async () => {
			const has = queueList.map((el) => el.title)
			const currentQueue = (await TrackPlayer.getQueue()) as any
			const deletePending = currentQueue
				.map((el: { title: string }, index: number) => (has.includes(el.title) ? -1 : index))
				.filter((el: number) => el > 0)
			if (deletePending.length > 0) {
				await TrackPlayer.remove(deletePending)
			}
			setNeedUpdate(false)
		}, 300)

		if (needUpdate) {
			sync()
		}
	}, [activeQueueId, queueList, setActiveTrack, needUpdate])

	const handleClick = useCallback(
		(track, index) => {
			// 1. 先更新UI状态，给用户立即的视觉反馈（比如动画）
			setActiveTrack(track)
			setLoadingTrackId(track.basename)
			// 2. 使用异步延迟的方式调用 TrackPlayer 的操作，让 React 有机会先更新UI并执行动画
			Promise.resolve().then(async () => {
				try {
					await TrackPlayer.skip(index)
					await TrackPlayer.play()
				} catch (error) {
					console.error('Error while trying to play track:', error)
				} finally {
					setLoadingTrackId(null) // 加载完成，取消loading标记
				}
			})
		},
		[setActiveTrack],
	)
	const renderItem = useCallback(
		({ item: track, index }: { item: any; index: number }) => {
			const isLoading = loadingTrackId === track.title
			return (
				<PlayListItem
					onDelete={onDelete}
					isLoading={isLoading}
					activeSong={currentTrack?.basename || ''}
					track={track}
					index={index}
					onTrackSelect={handleClick}
				/>
			)
		},
		[loadingTrackId, onDelete, currentTrack?.basename, handleClick],
	)

	return (
		<FlatList
			keyExtractor={(item, index) => `${item.basename}${index}${item.etag}`}
			contentContainerStyle={{ paddingTop: 10, paddingBottom: 300 }}
			ItemSeparatorComponent={ItemDivider}
			ListFooterComponent={ItemDivider}
			windowSize={1}
			initialNumToRender={10}
			removeClippedSubviews={false}
			contentInsetAdjustmentBehavior="automatic"
			ListEmptyComponent={
				<View>
					<Text style={utilsStyles.emptyContentText}>No playlist found</Text>
					<FastImage
						source={{ uri: unknownTrackImageUri, priority: FastImage.priority.normal }}
						style={utilsStyles.emptyContentImage}
					/>
				</View>
			}
			data={queue}
			renderItem={renderItem}
		/>
	)
}
