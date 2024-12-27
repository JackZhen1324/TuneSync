import { colors, fontSize } from '@/constants/tokens'
import { equals } from '@/helpers/utils'
import { defaultStyles } from '@/styles'
import { MaterialIcons } from '@expo/vector-icons'
import React, { memo, useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import { Track } from 'react-native-track-player'
import TracksListItemHeader from './TracksListItemHeader'
import TracksListItemHeaderActive from './TracksListItemHeaderActive'
import { StopPropagation } from './utils/StopPropagation'
export type TracksListItemProps = {
	isActive: boolean
	track: Track
	index: number
	isLoading: boolean
	onTrackSelect: (track: Track, index: number) => void
	onDelete: any
}

const PlayListItemComponent = ({
	isActive,
	track,
	index,
	isLoading,
	onTrackSelect: handleTrackSelect,
	onDelete: handleDelete,
}: TracksListItemProps) => {
	// const { activeTrack } = useActiveTrack()

	const handlePress = useCallback(() => {
		handleTrackSelect(track, index)
	}, [handleTrackSelect, track, index])

	return (
		<TouchableRipple centered={true} rippleColor="rgba(255, 255, 255, .005)" onPress={handlePress}>
			<View style={styles.trackItemContainer}>
				<View>
					{isActive ? (
						<TracksListItemHeaderActive
							track={track}
							isActive={isActive}
						></TracksListItemHeaderActive>
					) : (
						<TracksListItemHeader isLoading={isLoading} track={track}></TracksListItemHeader>
					)}
				</View>

				<View style={styles.trackDetailsContainer}>
					<View style={styles.trackTextContainer}>
						<Text
							numberOfLines={1}
							style={{
								...styles.trackTitleText,
								color: isActive ? colors.primary : colors.text,
							}}
						>
							{track.formatedTitle || track.basename}
						</Text>

						{track.artist && (
							<Text numberOfLines={1} style={styles.trackArtistText}>
								{track.artist}
							</Text>
						)}
					</View>

					{/* <Pressable > */}
					<StopPropagation>
						<MaterialIcons
							onPress={() => handleDelete(track, index)}
							name="delete-outline"
							size={24}
							color="gray"
						/>
					</StopPropagation>
					{/* </Pressable> */}
				</View>
			</View>
		</TouchableRipple>
	)
}

export const PlayListItem = memo(PlayListItemComponent, (preP, current) => {
	return (
		preP.isActive === current.isActive &&
		equals(preP.track, current.track) &&
		preP.isLoading === current.isLoading
	)
})

const styles = StyleSheet.create({
	loadingOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'rgba(0,0,0,0.3)',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 8,
	},
	trackItemContainer: {
		flexDirection: 'row',
		columnGap: 14,
		alignItems: 'center',
		paddingRight: 20,
	},
	trackPlayingIconIndicator: {
		position: 'absolute',
		top: 18,
		left: 16,
		width: 16,
		height: 16,
	},
	trackPausedIndicator: {
		position: 'absolute',
		top: 14,
		left: 14,
	},
	trackArtworkImage: {
		borderRadius: 8,
		width: 50,
		height: 50,
	},
	trackDetailsContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	trackTextContainer: {
		width: '96.6%',
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
})
