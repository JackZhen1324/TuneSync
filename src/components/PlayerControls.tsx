import { colors } from '@/constants/tokens'
import { FontAwesome6 } from '@expo/vector-icons'
import { memo, useState } from 'react'
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native'
import Animated, {
	Easing,
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from 'react-native-reanimated'
import TrackPlayer, { useIsPlaying } from 'react-native-track-player'

type PlayerControlsProps = {
	style?: ViewStyle
}

type PlayerButtonProps = {
	style?: ViewStyle
	iconSize?: number
}

export const PlayerControls = memo(({ style }: PlayerControlsProps) => {
	return (
		<View style={[styles.container, style]}>
			<View style={styles.row}>
				<SkipToPreviousButton />

				<PlayPauseButton />

				<SkipToNextButton />
			</View>
		</View>
	)
})

export const PlayPauseButton = memo(
	({ style, iconSize = 48, onPress }: PlayerButtonProps & { onPress?: () => void }) => {
		const { playing } = useIsPlaying()
		const [localPlaying, setLocalPlaying] = useState(playing)
		const animation = useSharedValue(1)
		const shadowAnimation = useSharedValue(0)

		const togglePlayingState = () => {
			setLocalPlaying((prev) => {
				if (!prev) {
					TrackPlayer.play()
				} else {
					TrackPlayer.pause()
				}
				return !prev
			})
		}

		const handlePress = () => {
			shadowAnimation.value = withTiming(1, {
				duration: 40,
				easing: Easing.inOut(Easing.ease),
			})

			animation.value = withTiming(
				0,
				{
					duration: 40,
					easing: Easing.inOut(Easing.ease),
				},
				(finished) => {
					if (finished) {
						runOnJS(togglePlayingState)()
						animation.value = withSpring(1.1, {
							damping: 15,
							stiffness: 150,
							mass: 1,
						})
						shadowAnimation.value = withTiming(0, {
							duration: 40,
							easing: Easing.inOut(Easing.ease),
						})
					}
				},
			)
			if (onPress) {
				onPress()
			}
		}

		const animatedStyle = useAnimatedStyle(() => {
			return {
				transform: [{ scale: animation.value }],
			}
		})

		const shadowStyle = useAnimatedStyle(() => {
			return {
				opacity: shadowAnimation.value ? 0.8 : 0,
				transform: [{ scale: shadowAnimation.value ? 1 : 0 }],
			}
		})

		return (
			<View style={[{ height: iconSize }, style]}>
				<TouchableOpacity activeOpacity={0.85} onPress={handlePress} style={styles.buttonContainer}>
					<Animated.View style={[styles.shadow, shadowStyle]} />
					<Animated.View style={animatedStyle}>
						<FontAwesome6
							name={localPlaying ? 'pause' : 'play'}
							size={iconSize}
							color={colors.text}
						/>
					</Animated.View>
				</TouchableOpacity>
			</View>
		)
	},
)

export const SkipToNextButton = memo(({ iconSize = 30 }: PlayerButtonProps) => {
	return (
		<TouchableOpacity activeOpacity={0.7} onPress={() => TrackPlayer.skipToNext()}>
			<FontAwesome6 name="forward" size={iconSize} color={colors.text} />
		</TouchableOpacity>
	)
})

export const SkipToPreviousButton = ({ iconSize = 30 }: PlayerButtonProps) => {
	return (
		<TouchableOpacity activeOpacity={0.7} onPress={() => TrackPlayer.skipToPrevious()}>
			<FontAwesome6 name="backward" size={iconSize} color={colors.text} />
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center',
	},
	shadow: {
		position: 'absolute',
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: 'rgba(0, 0, 0, 0.1)',
	},
	buttonContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
})
