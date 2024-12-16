import { TracksListItem } from '@/components/TracksListItem'
import { unknownTrackImageUri } from '@/constants/images'
import { screenPaddingXs } from '@/constants/tokens'
import { getCachedTrack } from '@/helpers/cache'
import { debounce } from '@/helpers/debounce'
import { useTrackPlayerQueue } from '@/hooks/useTrackPlayerQueue'
import { useActiveTrack } from '@/store/library'
import { utilsStyles } from '@/styles'
import { useCallback } from 'react'
import { FlatList, FlatListProps, InteractionManager, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import TrackPlayer, {
	Track,
	useActiveTrack as useActiveTrackAlternative,
	useIsPlaying,
} from 'react-native-track-player'
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
	const { setActiveTrack } = useActiveTrack((state) => state)
	const activeTrack = useActiveTrackAlternative()
	const { queue, addTrackToPlayer } = useTrackPlayerQueue()

	const isPLaying = useIsPlaying()
	const handleTrackSelect = useCallback(
		async (selected: Track) => {
			const selectedTrack = {
				...selected,
				id: queue.length,
			}
			setActiveTrack(selectedTrack)
			const index = queue.findIndex((el) => el.title === selectedTrack.title)

			if (index === -1) {
				await addTrackToPlayer(selectedTrack)
				await TrackPlayer.skip(queue.length)
			} else {
				await TrackPlayer.skip(index || 0)
			}

			TrackPlayer.play()
		},
		[addTrackToPlayer, queue, setActiveTrack],
	)
	const renderItem = useCallback(
		({ item: track }: { item: Track }) => {
			const isActive = activeTrack ? track.title === activeTrack.basename : false
			return (
				<TracksListItem
					from={from}
					isPLaying={isPLaying.playing}
					isActive={isActive}
					key={`${track?.filename}${track.url}${track.etag}`}
					track={track}
					onTrackSelect={handleTrackSelect}
				/>
			)
		},
		[activeTrack, from, handleTrackSelect, isPLaying.playing],
	)
	// console.log(tracks[0])
	const preload = useCallback((items) => {
		InteractionManager.runAfterInteractions(() => {
			// 执行长任务
			items.forEach(({ item }) => {
				if (item.from !== 'local') {
					getCachedTrack(item.url, item.basename || item.id)
				}
			})
		})
	}, [])
	return (
		<FlatList
			onViewableItemsChanged={debounce(
				({ viewableItems }: { viewableItems: FlatListProps<Track>['data'] }) => {
					preload(viewableItems)
				},
				200,
			)}
			style={{ paddingHorizontal: screenPaddingXs.horizontal }}
			data={tracks}
			renderItem={renderItem}
			keyExtractor={(item, index) => `${item.basename}${index}`}
			windowSize={2}
			removeClippedSubviews={true}
			contentInsetAdjustmentBehavior="automatic"
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
