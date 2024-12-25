import { TracksListItem } from '@/components/TracksListItem'
import { unknownTrackImageUri } from '@/constants/images'
import { screenPaddingXs } from '@/constants/tokens'
import { useTrackPlayerQueue } from '@/hooks/useTrackPlayerQueue'
import { useActiveTrack } from '@/store/library'
import { utilsStyles } from '@/styles'
import { useCallback, useState } from 'react'
import { FlatList, FlatListProps, Text, View } from 'react-native'
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
	const { addTrackToPlayer, skip } = useTrackPlayerQueue()
	const isPlaying = useIsPlaying()
	// 用于在点击后立即更新UI（例如：可在 TracksListItem 中根据 loadingTrackId 显示加载状态）
	const [loadingTrackId, setLoadingTrackId] = useState<string | null>(activeTrack?.basename || '')
	const handleTrackSelect = useCallback(
		(selected: Track) => {
			// 立即更新UI
			const selectedTrack = {
				...selected,
			}
			setActiveTrack(selectedTrack)
			setLoadingTrackId(selectedTrack.basename) // 标记正在加载的曲目

			// 在后台执行耗时操作
			Promise.resolve().then(async () => {
				try {
					const queue = await TrackPlayer.getQueue()
					const index = queue.findIndex((el) => el.title === selectedTrack.title)
					TrackPlayer.pause()
					if (index === -1) {
						await addTrackToPlayer(selectedTrack)
						await TrackPlayer.skip(queue.length)
					} else {
						await skip(index || 0, queue[index])
					}
					TrackPlayer.play()
				} catch (error) {
					console.error('Error while trying to play track:', error)
				} finally {
					setLoadingTrackId(null) // 加载完成，取消loading标记
				}
			})
		},
		[addTrackToPlayer, setActiveTrack, skip],
	)

	const renderItem = useCallback(
		({ item: track }: { item: Track }) => {
			const isActive = activeTrack ? track.title === activeTrack.basename : false
			const isLoading = loadingTrackId === track.title
			return (
				<TracksListItem
					from={from}
					isPLaying={isPlaying.playing}
					isActive={isActive}
					isLoading={isLoading}
					track={track}
					onTrackSelect={handleTrackSelect}
				/>
			)
		},
		[activeTrack, from, handleTrackSelect, isPlaying.playing, loadingTrackId],
	)

	return (
		<FlatList
			style={{ paddingHorizontal: screenPaddingXs.horizontal }}
			data={tracks}
			renderItem={renderItem}
			keyExtractor={(item, index) => `${item.basename}${index}${item?.etag}`}
			windowSize={2}
			removeClippedSubviews={true}
			contentInsetAdjustmentBehavior="automatic"
			contentContainerStyle={{ paddingBottom: 100 }}
			ListHeaderComponent={
				!hideQueueControls ? (
					<QueueControls tracks={tracks} style={{ paddingBottom: 20 }} />
				) : undefined
			}
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
