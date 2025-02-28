import { TrackShortcutsMenu } from '@/components/TrackShortcutsMenu'
import { StopPropagation } from '@/components/utils/StopPropagation'
import { colors, fontSize } from '@/constants/tokens'
import { defaultStyles } from '@/styles'
import { Entypo } from '@expo/vector-icons'
import React, { memo, useCallback } from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { Track } from 'react-native-track-player'
import TracksListItemHeader from './TracksListItemHeader'
import TracksListItemHeaderActive from './TracksListItemHeaderActive'

export type TracksListItemProps = {
	from?: string
	isPLaying?: boolean
	isActive: boolean
	isLoading?: boolean
	track: Track
	hideHeader?: boolean
	onTrackSelect: (track: Track) => void
}

const TracksListItemComponent = ({
	from,
	track,
	hideHeader,
	isLoading,
	isActive,
	onTrackSelect: handleTrackSelect,
}: TracksListItemProps) => {
	// 点击逻辑：点击后立即调用onTrackSelect，从外部控制逻辑和状态变更
	const handlePress = useCallback(() => {
		handleTrackSelect(track)
	}, [handleTrackSelect, track])

	if (!track) return null

	return (
		<TouchableHighlight underlayColor="transparent" onPress={handlePress}>
			<View style={styles.trackItemContainer}>
				{isActive ? (
					<TracksListItemHeaderActive
						track={track}
						isActive={isActive}
						isLoading={isLoading}
					></TracksListItemHeaderActive>
				) : (
					<TracksListItemHeader isLoading={isLoading} track={track}></TracksListItemHeader>
				)}

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
					{!hideHeader && (
						<StopPropagation>
							<TrackShortcutsMenu from={track.from} track={track}>
								<Entypo name="dots-three-horizontal" size={18} color={colors.icon} />
							</TrackShortcutsMenu>
						</StopPropagation>
					)}
				</View>
			</View>
		</TouchableHighlight>
	)
}

export const TracksListItem = memo(TracksListItemComponent, (preP, current) => {
	return (
		preP.isActive === current.isActive &&
		Object.is(preP.track, current.track) &&
		preP.isLoading === current.isLoading &&
		preP.hideHeader === current.hideHeader
	)
})

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
