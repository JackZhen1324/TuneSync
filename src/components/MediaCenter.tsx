import { unknownTrackImageUri } from '@/constants/images'
import { Playlist } from '@/helpers/types'
import { utilsStyles } from '@/styles'
import { FlatList, FlatListProps, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { DirectoryItem } from './DirectoryItem'

type MediaCenterProps = {
	data: Playlist[]
	onPlaylistPress: (playlist: Playlist) => void
} & Partial<FlatListProps<Playlist>>

const ItemDivider = () => (
	<View style={{ ...utilsStyles.itemSeparator, marginLeft: 80, marginVertical: 12 }} />
)

export const MediaCenter = ({
	data,
	onDirPress: handleDirPress,
	...flatListProps
}: MediaCenterProps) => {
	return (
		<FlatList
			keyExtractor={({ item }) => item}
			contentContainerStyle={{ paddingTop: 10, paddingBottom: 128 }}
			ItemSeparatorComponent={ItemDivider}
			ListFooterComponent={ItemDivider}
			ListEmptyComponent={
				<View>
					<Text style={utilsStyles.emptyContentText}>Empty Folder</Text>

					<FastImage
						source={{ uri: unknownTrackImageUri, priority: FastImage.priority.normal }}
						style={utilsStyles.emptyContentImage}
					/>
				</View>
			}
			data={data}
			renderItem={({ item }) => (
				<DirectoryItem data={item} onPress={(dir) => handleDirPress(item)} />
			)}
			{...flatListProps}
		/>
	)
}
