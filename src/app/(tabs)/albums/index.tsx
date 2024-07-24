import { AlbumsList } from '@/components/AblumList'
import { playlistNameFilter } from '@/helpers/filter'
import { Playlist } from '@/helpers/types'
import { useNavigationSearch } from '@/hooks/useNavigationSearch'
import { useAlbums } from '@/store/library'
import { defaultStyles } from '@/styles'
import { useRouter } from 'expo-router'
import { useMemo } from 'react'
import { View } from 'react-native'

const AlbumsScreen = () => {
	const router = useRouter()

	const search = useNavigationSearch({
		searchBarOptions: {
			placeholder: 'Find in ablums',
		},
	})

	const { albums } = useAlbums()

	const filteredAlbums = useMemo(() => {
		return albums?.filter(playlistNameFilter(search)) || []
	}, [albums, search])

	const handleAlbumsPress = (playlist: Playlist) => {
		router.push(`/(tabs)/albums/${playlist.name}`)
	}

	return (
		<View style={defaultStyles.container}>
			<AlbumsList albums={filteredAlbums} onAlbumPress={handleAlbumsPress} />
		</View>
	)
}

export default AlbumsScreen
