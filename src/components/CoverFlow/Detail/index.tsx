import { PlaylistTracksList } from '@/components/PlaylistTracksList'
import { useAlbums, usePlaylists, useTracks } from '@/store/library'
import React from 'react'
import {
	Animated,
	Dimensions,
	ScrollView,
	StyleSheet,
	TouchableWithoutFeedback,
} from 'react-native'

const styles = StyleSheet.create({
	container: {
		overflow: 'hidden',
		zIndex: 9999,
	},
	item: {
		backgroundColor: 'rgba(0,0,0,0.9)',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 20,
		borderRadius: 20,
	},
	song: {
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
	},
	songText: {
		fontSize: 16,
	},
})

const Detail = ({ id }: { id: number }) => {
	const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window')
	const { tracks } = useTracks()
	const { albums } = useAlbums(tracks)
	const { playlist } = usePlaylists()
	const collections = [...playlist, ...albums][id]

	return (
		<ScrollView scrollEnabled={false} style={styles.container}>
			<TouchableWithoutFeedback
				onPress={(e) => {
					e.stopPropagation()
					e.preventDefault()
				}}
			>
				<Animated.View style={{ ...styles.item, width: SCREEN_WIDTH * 0.4, height: SCREEN_HEIGHT }}>
					<PlaylistTracksList
						hideHeader
						from={collections?.[0]?.from || 'webdav'}
						playlist={collections}
					/>
				</Animated.View>
			</TouchableWithoutFeedback>
		</ScrollView>
	)
}
export default Detail
