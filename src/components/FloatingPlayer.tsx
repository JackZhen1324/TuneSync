import { PlayPauseButton, SkipToNextButton } from '@/components/PlayerControls'
import { unknownTrackImageUri } from '@/constants/images'
import { defaultStyles } from '@/styles'
import { useRouter, useSegments } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import {
	Animated,
	InteractionManager,
	StyleSheet,
	TouchableOpacity,
	View,
	ViewProps,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { useActiveTrack } from 'react-native-track-player'
import { MovingText } from './MovingText'
export const FloatingPlayer = ({ style }: ViewProps) => {
	const router = useRouter()
	const activeTrackObj = useActiveTrack()
	const displayedTrack = activeTrackObj
	const [initialHeight, setInitialHeight] = useState<number | null>(60)
	const heightAnim = useRef(new Animated.Value(60)).current
	const bottomAnim = useRef(new Animated.Value(78)).current // 初始bottom为78
	const leftAnim = useRef(new Animated.Value(8)).current
	const rightAnim = useRef(new Animated.Value(8)).current
	const imageHeightAnim = useRef(new Animated.Value(40)).current
	const opacityAnim = useRef(new Animated.Value(1)).current
	const segments: string[] = useSegments()
	useEffect(() => {
		const handle = InteractionManager.createInteractionHandle()
		// 当不在player页面时，恢复原状
		if (initialHeight !== null && !segments.includes('player')) {
			// 触发动画
			Animated.parallel([
				Animated.spring(heightAnim, {
					toValue: initialHeight,
					speed: 10,
					bounciness: 10,
					useNativeDriver: false,
				}),
				Animated.spring(bottomAnim, {
					toValue: 78, // -22
					bounciness: 10,
					speed: 10,
					useNativeDriver: false,
				}),
				Animated.spring(leftAnim, {
					toValue: 8,
					bounciness: 10,
					speed: 10,
					useNativeDriver: false,
				}),
				Animated.spring(rightAnim, {
					toValue: 8,
					bounciness: 10,
					speed: 10,
					useNativeDriver: false,
				}),
				Animated.timing(opacityAnim, {
					toValue: 1,
					duration: 200,
					useNativeDriver: false,
				}),
			]).start(() => {
				InteractionManager.clearInteractionHandle(handle)
			})
		}
	}, [
		segments,
		initialHeight,
		heightAnim,
		bottomAnim,
		leftAnim,
		rightAnim,
		imageHeightAnim,
		opacityAnim,
	])

	const handlePress = () => {
		router.push('/player')

		if (initialHeight === null) return

		// 增加100px高度，同时bottom减少100px，使卡片向下延展
		Animated.parallel([
			Animated.timing(heightAnim, {
				toValue: initialHeight + 15,
				duration: 150,
				useNativeDriver: false,
			}),
			Animated.timing(bottomAnim, {
				toValue: 78 - 15,
				duration: 150,
				useNativeDriver: false,
			}),
			Animated.timing(leftAnim, {
				toValue: 4,
				duration: 150,
				useNativeDriver: false,
			}),
			Animated.timing(rightAnim, {
				toValue: 4,
				duration: 150,
				useNativeDriver: false,
			}),
			Animated.timing(opacityAnim, {
				toValue: 0,
				duration: 150,
				useNativeDriver: false,
			}),
		]).start()
	}

	const onContainerLayout = (e: any) => {
		const h = e.nativeEvent.layout.height
		if (initialHeight === null) {
			setInitialHeight(h)
			heightAnim.setValue(h)
		}
	}

	if (!displayedTrack?.title) return null

	return (
		<Animated.View
			style={[
				styles.animatedContainer,
				style,
				{
					height: heightAnim,
					bottom: bottomAnim,
					left: leftAnim,
					right: rightAnim,
					opacity: opacityAnim,
				},
			]}
			onLayout={onContainerLayout}
		>
			<TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={styles.container}>
				<FastImage
					source={{
						uri: displayedTrack.artwork ?? unknownTrackImageUri,
					}}
					style={{ ...styles.trackArtworkImage }}
				/>

				<View style={styles.trackTitleContainer}>
					<MovingText
						style={styles.trackTitle}
						text={`${displayedTrack?.title}  ${displayedTrack?.artist || ''}`}
						animationThreshold={25}
					/>
				</View>

				<View style={styles.trackControlsContainer}>
					<PlayPauseButton iconSize={24} />
					<SkipToNextButton iconSize={22} />
				</View>
			</TouchableOpacity>
		</Animated.View>
	)
}

const styles = StyleSheet.create({
	animatedContainer: {
		position: 'absolute',
		// left: 8,
		// right: 8,
		// bottom通过Animated控制
		backgroundColor: '#252525',
		borderRadius: 12,
		overflow: 'hidden',
	},
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 8,
		paddingVertical: 10,
	},
	trackArtworkImage: {
		aspectRatio: 1,
		height: '95%',
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
