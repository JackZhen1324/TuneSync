import { AlbumsList } from '@/components/AblumList'
import { playlistNameFilter } from '@/helpers/filter'
import { Playlist } from '@/helpers/types'
import { useNavigationSearch } from '@/hooks/useNavigationSearch'
import { useAlbums, usePlaylists, useTracks } from '@/store/library'
import { defaultStyles } from '@/styles'
import { useRouter } from 'expo-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native'

const AlbumsScreen = () => {
	const router = useRouter()
	const { t } = useTranslation()
	const search = useNavigationSearch({
		searchBarOptions: {
			placeholder: t('collections.search'),
		},
	})
	const { tracks } = useTracks()

	const { albums } = useAlbums(tracks)
	const { playlist, setPlaylist } = usePlaylists((state) => state)
	const filteredAlbums = useMemo(() => {
		return [...playlist, ...(albums?.filter(playlistNameFilter(search)) || [])]
	}, [albums, playlist, search])

	const handleAlbumsPress = (playlist: Playlist, type: string) => {
		router.push(`/(tabs)/collections/${playlist.name}::${type}`)
	}

	return (
		<SafeAreaView style={defaultStyles.container}>
			<AlbumsList albums={filteredAlbums} onAlbumPress={handleAlbumsPress} />
		</SafeAreaView>
	)
}

export default AlbumsScreen
