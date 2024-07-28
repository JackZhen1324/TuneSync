import { unknownTrackImageUri } from '@/constants/images'
import { screenPadding } from '@/constants/tokens'
import { usePlaylists, useTracks } from '@/store/library'
import { utilsStyles } from '@/styles'
import { router } from 'expo-router'
import { useMemo } from 'react'
import { FlatList, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import CollectionsListItem from './CollectionsListItem'

export const ItemDivider = () => (
	<View style={{ ...utilsStyles.itemSeparator, marginLeft: 80, marginVertical: 12 }} />
)

export default (props: { targetTrack: any }) => {
	const { targetTrack } = props
	const { tracks } = useTracks()

	const { playlist, setPlaylist } = usePlaylists((state) => state)
	const matchedTrack = useMemo(() => {
		return tracks.find((el) => el.title === targetTrack)
	}, [targetTrack, tracks])

	return (
		<>
			<FlatList
				contentInsetAdjustmentBehavior="automatic"
				style={{
					paddingHorizontal: screenPadding.horizontal,
				}}
				contentContainerStyle={{ paddingTop: 10, paddingBottom: 128 }}
				ItemSeparatorComponent={ItemDivider}
				ListEmptyComponent={
					<View>
						<Text style={utilsStyles.emptyContentText}>No album found</Text>
						<FastImage
							source={{ uri: unknownTrackImageUri, priority: FastImage.priority.normal }}
							style={utilsStyles.emptyContentImage}
						/>
					</View>
				}
				data={playlist}
				renderItem={({ item }) => (
					<CollectionsListItem
						playlist={item}
						onPress={() => {
							const newPlaylist = playlist.map((el: { name: any; tracks: any }) => {
								if (el.name === item.name) {
									const newConfig = {
										...el,
										tracks: [...el.tracks, matchedTrack],
									}
									return newConfig
								}
								return el
							})
							setPlaylist(newPlaylist)
							router.back()
						}}
					/>
				)}
			/>
		</>
	)
}
