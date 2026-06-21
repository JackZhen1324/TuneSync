import { colors, fontSize } from '@/constants/tokens'
import { formatSecondsToMinutes } from '@/helpers/miscellaneous'
import { defaultStyles, utilsStyles } from '@/styles'
import { memo } from 'react'
import { StyleSheet, Text, View, ViewProps } from 'react-native'
import { Slider } from 'react-native-awesome-slider'
import { useSharedValue, withSpring } from 'react-native-reanimated'
import TrackPlayer, { useProgress } from 'react-native-track-player'

export const PlayerProgressBar = memo(({ style }: ViewProps) => {
	const { duration, position } = useProgress(250)

	const isSliding = useSharedValue(false)
	const progress = useSharedValue(0)
	const min = useSharedValue(0)
	const max = useSharedValue(1)
	const thumbScaleY = useSharedValue(1) // 用来控制缩放效果
	const thumbScaleX = useSharedValue(1) // 用来控制缩放效果

	const trackElapsedTime = formatSecondsToMinutes(position)
	const trackRemainingTime = formatSecondsToMinutes(duration - position)

	if (!isSliding.value) {
		progress.value = duration > 0 ? position / duration : 0
	}
	console.log('isSliding', isSliding)

	return (
		<View style={[style]}>
			<Slider
				style={{
					transform: [{ scaleY: thumbScaleY }, { scaleX: thumbScaleX }], // 控制 thumb 的缩放
				}}
				panHitSlop={{ top: 50, bottom: 100, left: 50, right: 50 }} // 扩展触
				progress={progress}
				minimumValue={min}
				maximumValue={max}
				containerStyle={utilsStyles.slider}
				thumbWidth={0}
				renderBubble={() => null}
				theme={{
					minimumTrackTintColor: isSliding.value
						? colors.minimumTrackTintColorOnTouch
						: colors.minimumTrackTintColor,
					maximumTrackTintColor: colors.maximumTrackTintColor,
				}}
				onSlidingStart={() => {
					thumbScaleY.value = withSpring(1.3)
					thumbScaleX.value = withSpring(1.02)
					isSliding.value = true
				}}
				onValueChange={async (value) => {
					await TrackPlayer.seekTo(value * duration)
				}}
				onSlidingComplete={async (value) => {
					// if the user is not sliding, we should not update the position
					if (!isSliding.value) return

					isSliding.value = false
					thumbScaleY.value = withSpring(1)
					thumbScaleX.value = withSpring(1)
					await TrackPlayer.seekTo(value * duration)
				}}
			/>

			<View style={styles.timeRow}>
				<Text style={[styles.timeText]}>{trackElapsedTime}</Text>

				<Text style={styles.timeText}>
					{'-'} {trackRemainingTime}
				</Text>
			</View>
		</View>
	)
})

const styles = StyleSheet.create({
	timeRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'baseline',
		marginTop: 20,
	},
	timeText: {
		...defaultStyles.text,
		color: colors.text,
		opacity: 0.75,
		fontSize: fontSize.xs,
		letterSpacing: 0.7,
		fontWeight: '500',
	},
})
