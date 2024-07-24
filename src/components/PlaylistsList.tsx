import { unknownTrackImageUri } from '@/constants/images'
import { useActiveTrack } from '@/store/library'
import { useQueueStore } from '@/store/queue'
import { utilsStyles } from '@/styles'
import { router } from 'expo-router'
import { useCallback } from 'react'
import { FlatList, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import TrackPlayer from 'react-native-track-player'
import { PlayListItem } from './PlaylistListItem'

const ItemDivider = () => (
	<View style={{ ...utilsStyles.itemSeparator, marginLeft: 80, marginVertical: 12 }} />
)

export const PlaylistsList = () => {
	const { activeQueueId, queueListWithContent, setQueueListContent } = useQueueStore(
		(state) => state,
	)
	const { setActiveTrack, activeTrack } = useActiveTrack((state) => state)

	const onDelete = useCallback(
		async (item: { title: any }) => {
			const targetIndex = queueListWithContent[activeQueueId].findIndex(
				(track: { title: any }) => track.title === item.title,
			)
			const filteredQueueListWithContent = [...queueListWithContent[activeQueueId]].filter(
				(el) => el.title !== item.title,
			)

			await TrackPlayer.remove([targetIndex])

			setQueueListContent(filteredQueueListWithContent, activeQueueId, queueListWithContent)

			// Update active track if the deleted item was the active track
			if (item.title === activeTrack) {
				const nextTrack =
					filteredQueueListWithContent[targetIndex] || filteredQueueListWithContent[targetIndex - 1]
				if (nextTrack) {
					setActiveTrack(nextTrack)
					await TrackPlayer.skip(targetIndex)
					await TrackPlayer.play()
				} else {
					setActiveTrack(undefined)
					router.back()
				}
			}
		},
		[activeQueueId, activeTrack, queueListWithContent, setActiveTrack, setQueueListContent],
	)

	const renderItem = useCallback(
		({ item: track }: any) => {
			return (
				<PlayListItem
					onDelete={onDelete}
					activeSong={activeTrack}
					key={track.filename}
					track={track}
					onTrackSelect={() => {
						setActiveTrack(track)
						const index = queueListWithContent[activeQueueId].findIndex(
							(el: { title: any }) => el.title === track.title,
						)
						TrackPlayer.skip(index)
						TrackPlayer.play()
					}}
				/>
			)
		},
		[activeQueueId, activeTrack, onDelete, queueListWithContent, setActiveTrack],
	)

	return (
		<FlatList
			contentContainerStyle={{ paddingTop: 10, paddingBottom: 300 }}
			ItemSeparatorComponent={ItemDivider}
			ListFooterComponent={ItemDivider}
			ListEmptyComponent={
				<View>
					<Text style={utilsStyles.emptyContentText}>No playlist found</Text>
					<FastImage
						source={{ uri: unknownTrackImageUri, priority: FastImage.priority.normal }}
						style={utilsStyles.emptyContentImage}
					/>
				</View>
			}
			data={queueListWithContent[activeQueueId]}
			renderItem={renderItem}
		/>
	)
}
