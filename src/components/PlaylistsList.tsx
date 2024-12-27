import { unknownTrackImageUri } from '@/constants/images'
import { useTrackPlayerQueue } from '@/hooks/useTrackPlayerQueue'
import { useActiveTrack } from '@/store/library'
import { utilsStyles } from '@/styles'
import { FlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import { LayoutAnimation, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import TrackPlayer, { useActiveTrack as useActiveTrackAlternative } from 'react-native-track-player'
import { PlayListItem } from './PlaylistListItem'

const ItemDivider = () => (
	<View style={{ ...utilsStyles.itemSeparator, marginLeft: 80, marginVertical: 12 }} />
)

export const PlaylistsList = () => {
	const { queue, remove, skip } = useTrackPlayerQueue()
	const { setActiveTrack } = useActiveTrack((state) => state)
	const currentTrack = useActiveTrackAlternative()
	const [loadingTrackId, setLoadingTrackId] = useState<string | null>(currentTrack?.basename || '')
	const list = useRef<FlashList<number> | null>(null)
	const onDelete = useCallback(
		async (item: { title: any }, index: number) => {
			// 尝试先更新UI状态，之后再异步处理实际的删除逻辑
			// setNeedUpdate(true)
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
			// This must be called before `LayoutAnimation.configureNext` in order for the animation to run properly.
			list.current?.prepareForLayoutAnimationRender()
			// After removing the item, we can start the animation.
			LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
		},
		[currentTrack?.basename, remove, setActiveTrack],
	)

	const handleClick = useCallback(
		async (track) => {
			const queue = await TrackPlayer.getQueue()
			const index = queue.findIndex((el) => el.basename === track.basename)
			// 1. 先更新UI状态，给用户立即的视觉反馈（比如动画）
			setActiveTrack(track)
			setLoadingTrackId(track.basename)
			// 2. 使用异步延迟的方式调用 TrackPlayer 的操作，让 React 有机会先更新UI并执行动画
			Promise.resolve().then(async () => {
				try {
					await skip(index, track)
					await TrackPlayer.play()
				} catch (error) {
					console.error('Error while trying to play track:', error)
				} finally {
					setLoadingTrackId(null) // 加载完成，取消loading标记
				}
			})
		},
		[setActiveTrack, skip],
	)
	const renderItem = useCallback(
		({ item: track, index }: { item: any; index: number }) => {
			const isLoading = loadingTrackId === track.title
			const isActive = currentTrack ? track.title === currentTrack.basename : false
			return (
				<PlayListItem
					onDelete={onDelete}
					isLoading={isLoading}
					isActive={isActive}
					track={track}
					index={index}
					onTrackSelect={handleClick}
				/>
			)
		},
		[loadingTrackId, currentTrack, onDelete, handleClick],
	)

	return (
		<FlashList
			extraData={{
				loadingTrackId,
				currentTrack,
			}}
			ref={list}
			estimatedItemSize={60}
			keyExtractor={(item, index) => `${item.basename}${index}${item.etag}`}
			contentContainerStyle={{ paddingTop: 10, paddingBottom: 300 }}
			ItemSeparatorComponent={ItemDivider}
			ListFooterComponent={ItemDivider}
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
