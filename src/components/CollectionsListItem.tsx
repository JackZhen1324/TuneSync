import { colors } from '@/constants/tokens'
import { Playlist } from '@/helpers/types'
import { defaultStyles } from '@/styles'
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { StyleSheet, Text, TouchableHighlight, TouchableHighlightProps, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { TouchableRipple } from 'react-native-paper'

type PlaylistListItemProps = {
	playlist: Playlist
} & TouchableHighlightProps

export default ({ playlist, ...props }: PlaylistListItemProps) => {
	const isAction = playlist.type === 'add'
	const isAlbum = playlist.type === 'album'
	const isPlaylist = playlist.type == 'playlist'

	return (
		<TouchableHighlight activeOpacity={0.8} {...props}>
			<View style={styles.playlistItemContainer}>
				<View>
					{isAction ? (
						<TouchableRipple
							style={{ ...styles.add }}
							onPress={() => {
								// router.push('/(tabs)/setting/resource')
							}}
							rippleColor="rgba(0, 0, 0, .32)"
						>
							<View style={styles.item}>
								<MaterialIcons name="add" size={50} color={colors.primary} />
							</View>
						</TouchableRipple>
					) : (
						<FastImage
							source={{
								uri: playlist.artworkPreview,
								priority: FastImage.priority.normal,
							}}
							style={styles.playlistArtworkImage}
						/>
					)}
					{isAlbum && (
						<View style={styles.overlayContainer}>
							<MaterialCommunityIcons name="album" size={16} color={colors.primary} />
						</View>
					)}
					{isPlaylist && (
						<View
							style={[
								styles.overlayContainer,
								{
									padding: 2,
								},
							]}
						>
							<MaterialCommunityIcons name="playlist-star" size={18} color={colors.primary} />
						</View>
					)}
				</View>

				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						width: '100%',
					}}
				>
					<Text numberOfLines={1} style={styles.playlistNameText}>
						{playlist.name}
					</Text>
					{!isAction && (
						<AntDesign name="right" size={16} color={colors.icon} style={{ opacity: 0.5 }} />
					)}
				</View>
			</View>
		</TouchableHighlight>
	)
}

const styles = StyleSheet.create({
	item: {
		backgroundColor: '#333',
		alignItems: 'center',
		justifyContent: 'center',
		// height: 30,
		// flex: 1,
		// width: size,
		borderRadius: 8,
		width: 70,
		height: 70,
		// margin: 5,
	},
	add: {
		backgroundColor: '#333',
		alignItems: 'center',
		justifyContent: 'center',
		// margin: 5,
		borderRadius: 8,
	},
	addText: {
		fontSize: 14,
		color: colors.icon,
		marginTop: 10,
	},
	playlistItemContainer: {
		flexDirection: 'row',
		columnGap: 14,
		alignItems: 'center',
		paddingRight: 90,
	},
	playlistArtworkImage: {
		borderRadius: 8,
		width: 70,
		height: 70,
	},
	playlistNameText: {
		...defaultStyles.text,
		fontSize: 17,
		fontWeight: '600',
		maxWidth: '80%',
	},
	overlayContainer: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		backgroundColor: 'rgba(0,0,0,0.6)',
		padding: 4,
		borderTopLeftRadius: 8,
		borderBottomLeftRadius: 8,
		borderTopRightRadius: 8,
	},
	overlayText: {
		color: 'white',
		fontSize: 12,
		fontWeight: 'bold',
	},
})
