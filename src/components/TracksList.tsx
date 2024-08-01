import { TracksListItem } from '@/components/TracksListItem'
import { unknownTrackImageUri } from '@/constants/images'
import { screenPaddingXs } from '@/constants/tokens'
import { debounce } from '@/helpers/debounce'
import { useActiveTrack } from '@/store/library'
import { useQueueStore } from '@/store/queue'
import { utilsStyles } from '@/styles'
import { useCallback, useEffect, useState } from 'react'
import { FlatList, FlatListProps, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import TrackPlayer, { Track } from 'react-native-track-player'
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
	const { activeQueueId, queueListWithContent, setQueueListContent, setActiveQueueId } =
		useQueueStore((state) => state)
	const { setActiveTrack, activeTrack } = useActiveTrack((state) => state)
	const [needUpdate, setNeedUpdate] = useState(false)
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
				setNeedUpdate(true)
			} else {
				await TrackPlayer.skip(index || 0)
				TrackPlayer.play()
			}
		},
		[activeQueueId, queueListWithContent, setActiveTrack, setQueueListContent],
	)
	useEffect(() => {
		const sync = debounce(async () => {
			await TrackPlayer.setQueue(queueListWithContent[activeQueueId])
			await TrackPlayer.skip(queueListWithContent[activeQueueId].length - 1 || 0)

			TrackPlayer.play()
			setNeedUpdate(false)
		}, 500)
		if (needUpdate) {
			sync()
		}
	}, [queueListWithContent, activeQueueId, needUpdate])
	const renderItem = useCallback(
		({ item: track, index }: any) => {
			return (
				<TracksListItem
					from={from}
					activeTrack={activeTrack}
					key={track?.filename}
					track={track}
					onTrackSelect={handleTrackSelect}
				/>
			)
		},
		[handleTrackSelect, activeTrack, from],
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
