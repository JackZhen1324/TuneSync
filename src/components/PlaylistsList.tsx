import { unknownTrackImageUri } from '@/constants/images'
import { debounce } from '@/helpers/debounce'
import { useTrackPlayerQueue } from '@/hooks/useTrackPlayerQueue'
import { useActiveTrack } from '@/store/library'
import { useQueueStore } from '@/store/queue'
import { utilsStyles } from '@/styles'
import { router } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
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

	const onDelete = useCallback(
		async (item: { title: any }, index: any) => {
			const resQueue = await remove(index || 0)

			if (resQueue.length < 1) {
				TrackPlayer.reset()
				setActiveTrack(undefined)
				router.back()
				return
			}

			if (currentTrack?.basename === item.title) {
				TrackPlayer.play()
			} else {
				setNeedUpdate(true)
			}
		},
		[currentTrack?.basename, remove, setActiveTrack],
	)
	useEffect(() => {
		const sync = debounce(async () => {
			const has = queueListWithContent[activeQueueId].map((el) => el.title)
			const queue = (await TrackPlayer.getQueue()) as any
			const deletePending = queue
				.map((el: { title: string }, index: any) => {
					if (has.includes(el.title)) {
						return -1
					}
					return index
				})
				.filter((el: number) => el > 0)
			await TrackPlayer.remove(deletePending)
			setNeedUpdate(false)
		}, 300)
		if (needUpdate) {
			sync()
		}
	}, [activeQueueId, queueListWithContent, setActiveTrack, needUpdate])
	const handleClick = useCallback(
		async (track, index) => {
			setActiveTrack(track)
			await TrackPlayer.skip(index)
			TrackPlayer.play()
		},
		[setActiveTrack],
	)
	const renderItem = useCallback(
		({ item: track, index }: any) => {
			return (
				<PlayListItem
					onDelete={onDelete}
					activeSong={currentTrack?.basename || ''}
					key={track.filename}
					track={track}
					index={index}
					onTrackSelect={handleClick}
				/>
			)
		},
		[onDelete, currentTrack?.basename, handleClick],
	)

	return (
		<FlatList
			keyExtractor={(item, index) => `${item.basename}${index}${item.etag}`}
			contentContainerStyle={{ paddingTop: 10, paddingBottom: 300 }}
			ItemSeparatorComponent={ItemDivider}
			ListFooterComponent={ItemDivider}
			windowSize={1}
			initialNumToRender={10}
			// removeClippedSubviews={true}
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
