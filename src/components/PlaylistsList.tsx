import { unknownTrackImageUri } from '@/constants/images'
import { debounce } from '@/helpers/debounce'
import { useActiveTrack } from '@/store/library'
import { useQueueStore } from '@/store/queue'
import { utilsStyles } from '@/styles'
import { router } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
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
	const [needUpdate, setNeedUpdate] = useState(false)
	const { setActiveTrack, activeTrack } = useActiveTrack((state) => state)

	const onDelete = useCallback(
		async (item: { title: any }) => {
			const filteredQueueListWithContent = [...queueListWithContent[activeQueueId]].filter(
				(el) => el.title !== item.title,
			)
			setQueueListContent(filteredQueueListWithContent, activeQueueId, queueListWithContent)
			if (filteredQueueListWithContent.length < 1) {
				TrackPlayer.reset()
				setActiveTrack(undefined)
				router.back()
				return
			}

			if (activeTrack === item.title) {
				await TrackPlayer.skipToNext()
				TrackPlayer.play()
			} else {
				setNeedUpdate(true)
			}
		},
		[activeQueueId, activeTrack, queueListWithContent, setActiveTrack, setQueueListContent],
	)
	useEffect(() => {
		const sync = debounce(async () => {
			const has = queueListWithContent[activeQueueId].map((el) => el.title)
			const queue = await TrackPlayer.getQueue()
			const deletePending = queue
				.map((el, index) => {
					if (has.includes(el.title)) {
						return -1
					}
					return index
				})
				.filter((el) => el > 0)
			await TrackPlayer.remove(deletePending)
			setNeedUpdate(false)
		}, 300)
		if (needUpdate) {
			sync()
		}
	}, [activeQueueId, queueListWithContent, setActiveTrack, needUpdate])

	const renderItem = useCallback(
		({ item: track }: any) => {
			return (
				<PlayListItem
					onDelete={onDelete}
					activeSong={activeTrack}
					key={track.filename}
					track={track}
					onTrackSelect={debounce(async () => {
						setActiveTrack(track)
						const index = queueListWithContent[activeQueueId].findIndex(
							(el: { title: any }) => el.title === track.title,
						)
						await TrackPlayer.skip(index)
						TrackPlayer.play()
					}, 100)}
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
