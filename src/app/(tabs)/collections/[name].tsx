import { PlaylistTracksList } from '@/components/PlaylistTracksList'
import { useAlbums, usePlaylists, useTracks } from '@/store/library'
import { defaultStyles } from '@/styles'
import { Redirect, useLocalSearchParams } from 'expo-router'
import { View } from 'react-native'

const PlaylistScreen = () => {
	const { name } = useLocalSearchParams<{ name: string }>()

	const [albumName, type] = name.split('::')

	const { tracks } = useTracks()

	const { albums } = useAlbums(tracks)
	const { playlist } = usePlaylists()
	const collections = [...playlist, ...albums].find((el) => el.name === albumName)

	if (!playlist) {
		console.warn(`Playlist ${albumName} was not found!`)

		return <Redirect href={'/(tabs)/albums'} />
	}

	return (
		<View style={defaultStyles.container}>
			<PlaylistTracksList from={name} playlist={collections} />
		</View>
	)
}

export default PlaylistScreen
