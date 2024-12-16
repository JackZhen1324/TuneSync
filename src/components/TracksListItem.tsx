import { TrackShortcutsMenu } from '@/components/TrackShortcutsMenu'
import { StopPropagation } from '@/components/utils/StopPropagation'
import { unknownTrackImageUri } from '@/constants/images'
import { colors, fontSize } from '@/constants/tokens'
import { defaultStyles } from '@/styles'
import { Entypo } from '@expo/vector-icons'
import React, { memo, useCallback } from 'react'
import { ActivityIndicator, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import LoaderKit from 'react-native-loader-kit'
import { Track } from 'react-native-track-player'

export type TracksListItemProps = {
	from?: string
	isPLaying?: boolean
	isActive: boolean
	isLoading?: boolean
	track: Track
	onTrackSelect: (track: Track) => void
}

const TracksListItemComponent = ({
	from,
	track,
	isActive,
	isPLaying,
	isLoading = false,
	onTrackSelect: handleTrackSelect,
}: TracksListItemProps) => {
	// 点击逻辑：点击后立即调用onTrackSelect，从外部控制逻辑和状态变更
	const handlePress = useCallback(() => {
		if (!isLoading) {
			handleTrackSelect(track)
		}
	}, [handleTrackSelect, track, isLoading])

	if (!track) return null

	return (
		<TouchableHighlight onPress={handlePress} disabled={isLoading}>
			<View style={styles.trackItemContainer}>
				<View style={styles.artworkContainer}>
					<FastImage
						source={{
							uri: track?.artwork || unknownTrackImageUri,
							priority: FastImage.priority.normal,
						}}
						style={[styles.trackArtworkImage, isActive && { opacity: 0.6 }]}
					/>
					{isActive && isPLaying && (
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

				<View style={styles.trackDetailsContainer}>
					<View style={styles.trackTextContainer}>
						<Text
							numberOfLines={1}
							style={[
								styles.trackTitleText,
								{ color: isActive ? colors.primary : colors.text },
								isLoading && { opacity: 0.7 },
							]}
						>
							{track.formatedTitle || track.basename || track.title || track.name}
						</Text>

						{track.artist && (
							<Text
								numberOfLines={1}
								style={[styles.trackArtistText, isLoading && { opacity: 0.7 }]}
							>
								{track.artist}
							</Text>
						)}
					</View>

					<StopPropagation>
						<TrackShortcutsMenu from={from} track={track}>
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
