/*
 * @Author: zhen qian xhdp123@126.com
 * @Date: 2025-01-24 22:54:46
 * @LastEditors: zhen qian xhdp123@126.com
 * @LastEditTime: 2025-03-07 03:20:52
 * @FilePath: /TuneSync/src/components/FloatingPlayer.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { PlayPauseButton, SkipToNextButton } from '@/components/PlayerControls'
import { unknownTrackImageUri } from '@/constants/images'

import { defaultStyles } from '@/styles'
import { useRouter } from 'expo-router'
import { StyleSheet, TouchableOpacity, View, ViewProps } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useActiveTrack } from 'react-native-track-player'
import { MovingText } from './MovingText'
type FloatingPlayerProps = {
	simpplifyMode?: boolean
} & ViewProps

export const FloatingPlayer = ({ style, simpplifyMode }: FloatingPlayerProps) => {
	const router = useRouter()
	const activeTrackObj = useActiveTrack()
	const displayedTrack = activeTrackObj

	const handlePress = () => {
		router.push('/player')
	}

	if (!displayedTrack?.title) return null

	return (
		<TouchableOpacity
			disabled={simpplifyMode}
			onPress={handlePress}
			activeOpacity={0.9}
			style={[styles.container, style]}
		>
			<>
				<FastImage
					source={{
						uri: displayedTrack.artwork ?? unknownTrackImageUri,
					}}
					style={styles.trackArtworkImage}
				/>

				<View style={styles.trackTitleContainer}>
					<MovingText
						style={styles.trackTitle}
						text={`${displayedTrack?.formatedTitle} - ${displayedTrack?.artist || ''}`}
						animationThreshold={simpplifyMode ? 10 : 25}
					/>
				</View>

				<View style={styles.trackControlsContainer}>
					<PlayPauseButton iconSize={24} />
					{!simpplifyMode && <SkipToNextButton iconSize={22} />}
				</View>
			</>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#252525',
		padding: 8,
		borderRadius: 12,
		paddingVertical: 10,
	},
	trackArtworkImage: {
		width: 40,
		height: 40,
		borderRadius: 8,
	},
	trackTitleContainer: {
		flex: 1,
		overflow: 'hidden',
		marginLeft: 10,
	},
	trackTitle: {
		...defaultStyles.text,
		fontSize: 18,
		fontWeight: '600',
		paddingLeft: 10,
	},
	trackControlsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: 20,
		marginRight: 16,
		paddingLeft: 16,
	},
})
