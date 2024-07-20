import { TrackShortcutsMenu } from '@/components/TrackShortcutsMenu'
import { StopPropagation } from '@/components/utils/StopPropagation'
import { unknownTrackImageUri } from '@/constants/images'
import { colors, fontSize } from '@/constants/tokens'
import { defaultStyles } from '@/styles'
import { Entypo } from '@expo/vector-icons'
import React, { memo, useCallback, useMemo } from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import LoaderKit from 'react-native-loader-kit'
import { Track } from 'react-native-track-player'

export type TracksListItemProps = {
	track: Track
	onTrackSelect: (track: Track) => void
	activeSong: string
}

const TracksListItemComponent = ({
	activeSong,
	track,
	onTrackSelect: handleTrackSelect,
}: TracksListItemProps) => {
	const isAtive = useMemo(() => {
		return activeSong === track.title
	}, [activeSong, track.title])
	const handlePress = useCallback(() => {
		handleTrackSelect(track)
	}, [handleTrackSelect, track])

	return (
		<TouchableHighlight onPress={handlePress}>
			<View style={styles.trackItemContainer}>
				<View>
					<FastImage
						source={{
							uri: track.artwork || unknownTrackImageUri,
							priority: FastImage.priority.normal,
						}}
						style={{
							...styles.trackArtworkImage,
							opacity: isAtive ? 0.6 : 1,
						}}
					/>

					{isAtive && (
						<LoaderKit
							style={styles.trackPlayingIconIndicator}
							name="LineScaleParty"
							color={colors.icon}
						/>
					)}
				</View>

				<View style={styles.trackDetailsContainer}>
					<View style={styles.trackTextContainer}>
						<Text
							numberOfLines={1}
							style={{
								...styles.trackTitleText,
								color: isAtive ? colors.primary : colors.text,
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

					<StopPropagation>
						<TrackShortcutsMenu track={track}>
							<Entypo name="dots-three-horizontal" size={18} color={colors.icon} />
						</TrackShortcutsMenu>
					</StopPropagation>
				</View>
			</View>
		</TouchableHighlight>
	)
}

export const TracksListItem = memo(TracksListItemComponent)

const styles = StyleSheet.create({
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
		width: '100%',
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
