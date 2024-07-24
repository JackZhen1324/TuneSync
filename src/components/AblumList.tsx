// import { PlaylistListItem } from '@/components/PlaylistListItem'
import { unknownTrackImageUri } from '@/constants/images'
import { screenPadding } from '@/constants/tokens'
import { playlistNameFilter } from '@/helpers/filter'
import { useNavigationSearch } from '@/hooks/useNavigationSearch'
import { utilsStyles } from '@/styles'
import { useMemo } from 'react'
import { FlatList, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { AblumListItem } from './AblumListItem'

type AlbumsListProps = {
	albums: any
	onAlbumPress: any
}

export const ItemDivider = () => (
	<View style={{ ...utilsStyles.itemSeparator, marginLeft: 80, marginVertical: 12 }} />
)

export const AlbumsList = ({
	albums,
	onAlbumPress: handleAlbumPress,
	...flatListProps
}: AlbumsListProps) => {
	const search = useNavigationSearch({
		searchBarOptions: {
			placeholder: 'Find in Albums',
		},
	})

	const filteredAlbums = useMemo(() => {
		return albums.filter(playlistNameFilter(search))
	}, [albums, search])

	return (
		<FlatList
			contentInsetAdjustmentBehavior="automatic"
			style={{
				paddingHorizontal: screenPadding.horizontal,
			}}
			contentContainerStyle={{ paddingTop: 10, paddingBottom: 128 }}
			ItemSeparatorComponent={ItemDivider}
			// ListFooterComponent={ItemDivider}
			ListEmptyComponent={
				<View>
					<Text style={utilsStyles.emptyContentText}>No album found</Text>
					<FastImage
						source={{ uri: unknownTrackImageUri, priority: FastImage.priority.normal }}
						style={utilsStyles.emptyContentImage}
					/>
				</View>
			}
			data={filteredAlbums}
			renderItem={({ item: playlist }) => (
				<AblumListItem playlist={playlist} onPress={() => handleAlbumPress(playlist)} />
			)}
			{...flatListProps}
		/>
	)
}
