import { colors } from '@/constants/tokens'
import { FontAwesome6 } from '@expo/vector-icons'
import { memo, useRef } from 'react'
import { Animated, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native'
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

export const PlayPauseButton = memo(({ style, iconSize = 48 }: PlayerButtonProps) => {
	const { playing } = useIsPlaying()
	const scaleAnim = useRef(new Animated.Value(1)).current // 控制大小
	const handlePressIn = () => {
		// 按下时的动画
		Animated.parallel([
			Animated.spring(scaleAnim, {
				toValue: 0.8, // 缩小到90%
				bounciness: 10,
				useNativeDriver: true,
			}),
		]).start()
	}

	const handlePressOut = () => {
		// 松开时的动画
		Animated.parallel([
			Animated.spring(scaleAnim, {
				toValue: 1, // 恢复到原始大小
				bounciness: 10,
				useNativeDriver: true,
			}),
		]).start()
	}
	return (
		<View
			style={[
				{ height: iconSize, width: iconSize, flexDirection: 'row', justifyContent: 'center' },
				style,
			]}
		>
			<Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
				<TouchableOpacity
					activeOpacity={0.85}
					onPressIn={handlePressIn}
					onPressOut={handlePressOut}
					onPress={playing ? TrackPlayer.pause : TrackPlayer.play}
				>
					<FontAwesome6 name={playing ? 'pause' : 'play'} size={iconSize} color={colors.text} />
				</TouchableOpacity>
			</Animated.View>
		</View>
	)
})

export const SkipToNextButton = memo(({ iconSize = 30 }: PlayerButtonProps) => {
	const scaleAnim = useRef(new Animated.Value(1)).current // 控制大小
	const handlePressIn = () => {
		// 按下时的动画
		Animated.parallel([
			Animated.spring(scaleAnim, {
				toValue: 0.8, // 缩小到90%
				bounciness: 10,
				useNativeDriver: true,
			}),
		]).start()
	}

	const handlePressOut = () => {
		// 松开时的动画
		Animated.parallel([
			Animated.spring(scaleAnim, {
				toValue: 1, // 恢复到原始大小
				bounciness: 10,
				useNativeDriver: true,
			}),
		]).start()
	}
	return (
		<Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
			<TouchableOpacity
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				activeOpacity={0.7}
				onPress={() => TrackPlayer.skipToNext()}
			>
				<FontAwesome6 name="forward" size={iconSize} color={colors.text} />
			</TouchableOpacity>
		</Animated.View>
	)
})

export const SkipToPreviousButton = ({ iconSize = 30 }: PlayerButtonProps) => {
	const scaleAnim = useRef(new Animated.Value(1)).current // 控制大小
	const handlePressIn = () => {
		// 按下时的动画
		Animated.parallel([
			Animated.spring(scaleAnim, {
				toValue: 0.8, // 缩小到90%
				bounciness: 10,
				useNativeDriver: true,
			}),
		]).start()
	}

	const handlePressOut = () => {
		// 松开时的动画
		Animated.parallel([
			Animated.spring(scaleAnim, {
				toValue: 1, // 恢复到原始大小
				bounciness: 10,
				useNativeDriver: true,
			}),
		]).start()
	}
	return (
		<Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
			<TouchableOpacity
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				activeOpacity={0.7}
				onPress={() => TrackPlayer.skipToPrevious()}
			>
				<FontAwesome6 name={'backward'} size={iconSize} color={colors.text} />
			</TouchableOpacity>
		</Animated.View>
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
})
