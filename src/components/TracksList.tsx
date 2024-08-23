import { TracksListItem } from '@/components/TracksListItem'
import { unknownTrackImageUri } from '@/constants/images'
import { screenPaddingXs } from '@/constants/tokens'
import { useActiveTrack } from '@/store/library'
import { useQueueStore } from '@/store/queue'
import { utilsStyles } from '@/styles'
import { useCallback } from 'react'
import { FlatList, FlatListProps, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import TrackPlayer, { Track, useIsPlaying } from 'react-native-track-player'
import { QueueControls } from './QueueControls'
export type TracksListProps = Partial<FlatListProps<Track>> & {
	id: string
	tracks: Track[]
	hideQueueControls?: boolean
	search?: string
	from?: string
}

const ItemDivider = () => (
	<View style={{ ...utilsStyles.itemSeparator, marginVertical: 9, marginLeft: 60 }} />
)

export const TracksList = ({
	from,
	tracks,
	hideQueueControls = false,
	...flatlistProps
}: TracksListProps) => {
	const { activeQueueId, queueListWithContent, setQueueListContent } = useQueueStore(
		(state) => state,
	)
	const { setActiveTrack, activeTrack } = useActiveTrack((state) => state)
	const isPLaying = useIsPlaying()
	const handleTrackSelect = useCallback(
		async (selectedTrack: Track) => {
			setActiveTrack(selectedTrack)
			const index = queueListWithContent[activeQueueId].findIndex(
				(el: { title: string | undefined }) => el.title === selectedTrack.title,
			)
			if (index === -1) {
				const filteredList = queueListWithContent[activeQueueId].filter(
					(el: { title: string | undefined }) => el.title !== selectedTrack.title,
				)
				setQueueListContent([...filteredList, selectedTrack], activeQueueId, queueListWithContent)
				await TrackPlayer.add([selectedTrack])

				await TrackPlayer.pause()
				await TrackPlayer.skip(queueListWithContent[activeQueueId].length - 1 || 0)
				TrackPlayer.play()
			} else {
				await TrackPlayer.pause()
				await TrackPlayer.skip(index || 0)
				TrackPlayer.play()
			}
		},
		[activeQueueId, queueListWithContent, setActiveTrack, setQueueListContent],
	)
	const renderItem = useCallback(
		({ item: track }: any, index: number) => {
			const isActive = track.title === activeTrack
			return (
				<TracksListItem
					from={from}
					isPLaying={isPLaying.playing}
					isActive={isActive}
					key={`${track?.filename}${track.url}${track.etag}${index}`}
					track={track}
					onTrackSelect={handleTrackSelect}
				/>
			)
		},
		[handleTrackSelect, activeTrack, from, isPLaying],
	)

	return (
		<FlatList
			style={{ paddingHorizontal: screenPaddingXs.horizontal }}
			contentInsetAdjustmentBehavior="automatic"
			data={tracks}
			renderItem={renderItem}
			keyExtractor={(item, index) => `${item?.filename}${item.url}${item.etag}${index}`}
			scrollEventThrottle={400}
			onEndReachedThreshold={0.5}
			removeClippedSubviews={true}
			contentContainerStyle={{ paddingBottom: 100 }}
			ListHeaderComponent={
				!hideQueueControls ? (
					<QueueControls tracks={tracks} style={{ paddingBottom: 20 }} />
				) : undefined
			}
			// ListFooterComponent={ItemDivider}
			ItemSeparatorComponent={ItemDivider}
			ListEmptyComponent={
				<View>
					<Text style={utilsStyles.emptyContentText}>No songs found</Text>
					<FastImage
						source={{ uri: unknownTrackImageUri, priority: FastImage.priority.normal }}
						style={utilsStyles.emptyContentImage}
					/>
				</View>
			}
			{...flatlistProps}
		/>
	)
}
