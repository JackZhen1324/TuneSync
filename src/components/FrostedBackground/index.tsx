import { useCoverflowStore } from '@/store/coverflow'
import { BlurView } from 'expo-blur'
import React, { useEffect, useRef } from 'react'
import {
	Animated,
	Dimensions,
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	View,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { useIsPlaying } from 'react-native-track-player'
import { FloatingPlayer } from '../FloatingPlayer'

interface FrostedBackgroundProps {
	source: string
	selected: {
		name: string
		artist: string
	}
	children: React.ReactNode
	setDetail: (isDetial: boolean) => void
}

const FrostedBackground: React.FC<FrostedBackgroundProps> = ({
	source,
	selected,
	children,
	setDetail,
}) => {
	const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window')
	const widthAnimiation = useRef(new Animated.Value(80)).current
	const isPlaying = useIsPlaying()
	const { togleDetail } = useCoverflowStore()
	useEffect(() => {
		if (isPlaying.playing) {
			Animated.timing(widthAnimiation, {
				toValue: 160,
				duration: 300,
				useNativeDriver: false,
			}).start()
		} else {
			Animated.timing(widthAnimiation, {
				toValue: 120,
				duration: 300,
				useNativeDriver: false,
			}).start()
		}
	}, [isPlaying, widthAnimiation])
	return (
		<TouchableWithoutFeedback
			onPress={() => {
				setDetail(false)
				togleDetail(true)
			}}
		>
			<View style={styles.container}>
				<FastImage source={{ uri: source }} style={styles.imageBackground}>
					<BlurView intensity={90} style={styles.blur}>
						{children}
					</BlurView>
				</FastImage>

				<View style={{ ...styles.content, bottom: 0.13 * SCREEN_HEIGHT }}>
					<Text style={styles.text}>{selected?.name}</Text>
					<Text style={styles.subText}>{selected?.artist}</Text>
					<FloatingPlayer
						simpplifyMode
						style={{
							width: widthAnimiation,
							position: 'absolute',
							left: 0,
							right: 0,
							bottom: 0,
						}}
					/>
				</View>
			</View>
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	imageBackground: {
		flex: 1,
		resizeMode: 'cover', // 背景图片适应模式
	},
	blur: {
		...StyleSheet.absoluteFillObject, // 使 BlurView 填满整个背景
	},
	content: {
		width: '100%',
		position: 'absolute',
		left: 0,
		right: 0,
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		fontSize: 16,
		color: '#fff',
		fontWeight: 'bold',
	},
	subText: {
		fontSize: 14,
		color: '#ddd',
		marginTop: 10,
	},
})

export default FrostedBackground
