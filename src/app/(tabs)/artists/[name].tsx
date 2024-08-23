import { ArtistTracksList } from '@/components/ArtistTracksList'
import { screenPaddingXs } from '@/constants/tokens'
import { useArtists, useTracks } from '@/store/library'
import { defaultStyles } from '@/styles'
import { Redirect, useLocalSearchParams } from 'expo-router'
import { View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

const ArtistDetailScreen = () => {
	const { name: artistName } = useLocalSearchParams<{ name: string }>()
	const { tracks } = useTracks()
	const artists = useArtists(tracks)

	const artist = artists.find((artist) => artist.name === artistName.replaceAll('-', '/'))

	if (!artist) {
		console.warn(`Artist ${artistName} not found!`)

		return <Redirect href={'/(tabs)/artists'} />
	}

	return (
		<View style={defaultStyles.container}>
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				style={{ paddingHorizontal: screenPaddingXs.horizontal }}
			>
				<ArtistTracksList artist={artist} />
			</ScrollView>
		</View>
	)
}

export default ArtistDetailScreen
