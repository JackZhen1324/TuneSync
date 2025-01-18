import { unknownTrackImageUri } from '@/constants/images'
import { colors, fontSize } from '@/constants/tokens'
import { defaultStyles } from '@/styles'
import React from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import LoaderKit from 'react-native-loader-kit'
import { useIsPlaying } from 'react-native-track-player'

export type TracksListItemHeaderProps = {
	isActive: boolean
	isLoading?: boolean
	track?: any
}

const TracksListItemHeaderActive = ({ track, isActive, isLoading }: TracksListItemHeaderProps) => {
	const isPlay = useIsPlaying()

	return (
		<View style={styles.artworkContainer}>
			<FastImage
				source={{
					uri: track?.artwork || unknownTrackImageUri,
					priority: FastImage.priority.normal,
				}}
				style={[styles.trackArtworkImage, isActive && { opacity: 0.6 }]}
			/>
			{isActive && isPlay.playing && (
				<LoaderKit
					style={styles.trackPlayingIconIndicator}
					name="LineScaleParty"
					color={colors.icon}
				/>
			)}
			{isLoading && (
				<View style={styles.loadingOverlay}>
					<ActivityIndicator size="small" color="#fff" />
				</View>
			)}
		</View>
	)
}
export default React.memo(TracksListItemHeaderActive)

const styles = StyleSheet.create({
	trackItemContainer: {
		flexDirection: 'row',
		paddingRight: 20,
		alignItems: 'center',
	},
	artworkContainer: {
		position: 'relative',
	},
	trackArtworkImage: {
		borderRadius: 8,
		width: 50,
		height: 50,
	},
	trackPlayingIconIndicator: {
		position: 'absolute',
		top: 18,
		left: 16,
		width: 16,
		height: 16,
	},
	trackDetailsContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginLeft: 14, // 移出 columnGap，根据实际需求调整
	},
	trackTextContainer: {
		flex: 1,
	},
	trackTitleText: {
		...defaultStyles.text,
		fontSize: fontSize.sm,
		fontWeight: '600',
		maxWidth: '90%',
	},
	trackArtistText: {
		...defaultStyles.text,
		color: colors.textMuted,
		fontSize: 14,
		marginTop: 4,
	},
	loadingOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'rgba(0,0,0,0.3)',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 8,
	},
})
