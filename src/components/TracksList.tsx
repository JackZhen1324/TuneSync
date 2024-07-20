import { TracksListItem } from '@/components/TracksListItem'
import { unknownTrackImageUri } from '@/constants/images'
import { screenPadding } from '@/constants/tokens'
import { useQueue } from '@/store/queue'
import { utilsStyles } from '@/styles'
import { useCallback, useRef, useState } from 'react'
import { FlatList, FlatListProps, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import TrackPlayer, { Track } from 'react-native-track-player'
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

export const TracksList = ({
	search,
	id,
	setPage,
	currentPage,
	tracks,
	hideQueueControls = false,
	...flatlistProps
}: TracksListProps) => {
	const queueOffset = useRef(0)
	const { activeQueueId, setActiveQueueId } = useQueue()
	const [activeSong, setAtiveSong] = useState('')
	const handleTrackSelect = useCallback(
		async (selectedTrack: Track) => {
			setAtiveSong(selectedTrack.title)
			await TrackPlayer.reset()
			await TrackPlayer.add([selectedTrack])
			await TrackPlayer.play()
		},
		[tracks, id, activeQueueId, setActiveQueueId, queueOffset],
	)
	const renderItem = useCallback(
		({ item: track }: any) => {
			return (
				<TracksListItem
					activeSong={activeSong}
					key={track.filename}
					track={track}
					onTrackSelect={handleTrackSelect}
				/>
			)
		},
		[handleTrackSelect, activeSong],
	)

	return (
		<FlatList
			contentInsetAdjustmentBehavior="automatic"
			style={{ paddingHorizontal: screenPadding.horizontal }}
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
