import { TracksListItem } from '@/components/TracksListItem'
import { unknownTrackImageUri } from '@/constants/images'
import { screenPaddingXs } from '@/constants/tokens'
import { useActiveTrack } from '@/store/library'
import { useQueueStore } from '@/store/queue'
import { utilsStyles } from '@/styles'
import { useCallback } from 'react'
import { FlatList, FlatListProps, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import TrackPlayer, { Event, Track, useTrackPlayerEvents } from 'react-native-track-player'
import { QueueControls } from './QueueControls'

export type TracksListProps = Partial<FlatListProps<Track>> & {
	id: string
	tracks: Track[]
	hideQueueControls?: boolean
	search?: string
}

const ItemDivider = () => (
	<View style={{ ...utilsStyles.itemSeparator, marginVertical: 9, marginLeft: 60 }} />
)
export const debounce = (
	func: { (event: any): Promise<void>; apply?: any },
	wait: number | undefined,
) => {
	let timeout: string | number | NodeJS.Timeout | undefined

	return function (...args: any) {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const context = this

		clearTimeout(timeout)
		timeout = setTimeout(() => {
			func.apply(context, args)
		}, wait)
	}
}
export const TracksList = ({
	tracks,
	hideQueueControls = false,
	...flatlistProps
}: TracksListProps) => {
	const { activeQueueId, queueListWithContent, setQueueListContent, setActiveQueueId } =
		useQueueStore((state) => state)
	const { setActiveTrack, activeTrack } = useActiveTrack((state) => state)

	useTrackPlayerEvents(
		[Event.PlaybackState],
		debounce(async (event: { state: string }) => {
			if (event.state === 'playing') {
				const track = await TrackPlayer.getActiveTrack()
				const activeIndex = await TrackPlayer.getActiveTrackIndex()
				setActiveTrack(track, activeIndex)
			}
		}, 10),
	)
	const handleTrackSelect = useCallback(
		async (selectedTrack: Track) => {
			setActiveTrack(selectedTrack)
			const index = queueListWithContent[activeQueueId].findIndex(
				(el: { title: string | undefined }) => el.title === selectedTrack.title,
			)

			if (index === -1) {
				// await TrackPlayer.reset()
				const filteredList = queueListWithContent[activeQueueId].filter(
					(el: { title: string | undefined }) => el.title !== selectedTrack.title,
				)
				setQueueListContent([...filteredList, selectedTrack], activeQueueId, queueListWithContent)

				await TrackPlayer.setQueue([...filteredList, selectedTrack])
				await TrackPlayer.skip(filteredList.length)
				TrackPlayer.play()
			} else {
				await TrackPlayer.skip(index)
				TrackPlayer.play()
			}
		},
		[activeQueueId, queueListWithContent, setActiveTrack, setQueueListContent],
	)
	const renderItem = useCallback(
		({ item: track, index }: any) => {
			return (
				<TracksListItem
					activeTrack={activeTrack}
					key={track.filename}
					track={track}
					onTrackSelect={handleTrackSelect}
				/>
			)
		},
		[handleTrackSelect, activeTrack],
	)

	return (
		<FlatList
			style={{ paddingHorizontal: screenPaddingXs.horizontal }}
			contentInsetAdjustmentBehavior="automatic"
			data={tracks}
			renderItem={renderItem}
			keyExtractor={(item) => item?.filename}
			scrollEventThrottle={400}
			onEndReachedThreshold={0.5}
			maxToRenderPerBatch={15}
			initialNumToRender={15}
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
