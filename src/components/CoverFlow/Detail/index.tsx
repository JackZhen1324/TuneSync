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

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window')

const styles = StyleSheet.create({
	container: {
		overflow: 'hidden',
		zIndex: 9999,
	},
	item: {
		width: SCREEN_WIDTH * 0.4,
		height: SCREEN_HEIGHT,
		backgroundColor: 'rgba(0,0,0,0.9)',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 20,
		borderRadius: 10,
	},
	flippedItem: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
		backgroundColor: '#fff',
		justifyContent: 'flex-start',
		alignItems: 'center',
		zIndex: 2,
		borderRadius: 0,
		paddingTop: 40,
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
	const { tracks } = useTracks()

	const { albums } = useAlbums(tracks)
	const { playlist } = usePlaylists()
	const collections = [...playlist, ...albums][id]

	return (
		<ScrollView scrollEnabled={false} style={styles.container}>
			<TouchableWithoutFeedback
				onPress={(e) => {
					e.stopPropagation()
				}}
			>
				<Animated.View style={[styles.item]}>
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
