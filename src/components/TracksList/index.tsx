import { TracksListItem } from '@/components/TracksList/TracksListItem'
import { unknownTrackImageUri } from '@/constants/images'
import { screenPaddingXs } from '@/constants/tokens'
import { useActiveTrack } from '@/store/library'
import { utilsStyles } from '@/styles'
import { FlashList, FlashListProps } from '@shopify/flash-list'
import { memo, useCallback, useState } from 'react'
import { Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import TrackPlayer, {
	Track,
	useActiveTrack as useActiveTrackAlternative,
	useIsPlaying,
} from 'react-native-track-player'
import { QueueControls } from '../QueueControls'

export type TracksListProps = Partial<FlashListProps<Track>> & {
	tracks: Track[]
	hideQueueControls?: boolean
	search?: string
	from?: string
	hideHeader?: boolean
}

const ItemDivider = () => (
	<View style={{ ...utilsStyles.itemSeparator, marginVertical: 9, marginLeft: 60 }} />
)

export const TracksList = memo(
	({ from, tracks, hideHeader, hideQueueControls = false, ...flashlistProps }: TracksListProps) => {
		const { setActiveTrack } = useActiveTrack((state) => state)
		const activeTrack = useActiveTrackAlternative()
		const isPlaying = useIsPlaying()
		const [loadingTrackId, setLoadingTrackId] = useState<string | null>(activeTrack?.basename || '')

		const handleTrackSelect = useCallback(
			(selected: Track) => {
				const selectedTrack = {
					...selected,
				}
				setActiveTrack(selectedTrack)
				setLoadingTrackId(selectedTrack.basename)
				Promise.resolve().then(async () => {
					try {
						const queue = await TrackPlayer.getQueue()
						const index = queue.findIndex((el) => el.title === selectedTrack.title)
						TrackPlayer.pause()
						if (index === -1) {
							await TrackPlayer.add(selectedTrack)
							await TrackPlayer.skip(queue.length)
						} else {
							await TrackPlayer.skip(index || 0)
						}
						TrackPlayer.play()
					} catch (error) {
						console.error('Error while trying to play track:', error)
					} finally {
						setLoadingTrackId(null)
					}
				})
			},
			[setActiveTrack],
		)

		const renderItem = useCallback(
			({ item: track }: { item: Track }) => {
				const isActive = activeTrack ? track.title === activeTrack.basename : false
				const isLoading = loadingTrackId === track.title

				return (
					<TracksListItem
						hideHeader={hideHeader}
						from={from}
						isPLaying={isPlaying.playing}
						isActive={isActive}
						isLoading={isLoading}
						track={track}
						onTrackSelect={handleTrackSelect}
					/>
				)
			},
			[activeTrack, from, handleTrackSelect, isPlaying, loadingTrackId, hideHeader],
		)

		return (
			<FlashList
				extraData={{
					activeTrack,
					isPlaying,
					loadingTrackId,
					from,
				}}
				contentContainerStyle={{
					paddingLeft: screenPaddingXs.horizontal,
					paddingRight: screenPaddingXs.horizontal,
					paddingBottom: 100,
				}}
				data={tracks}
				renderItem={renderItem}
				keyExtractor={(item, index) => `${item.basename}${index}${item?.etag}`}
				estimatedItemSize={60}
				contentInsetAdjustmentBehavior="automatic"
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
				{...flashlistProps}
			/>
		)
	},
)
