import { BlurView } from 'expo-blur'
import React, { useEffect, useRef } from 'react'
import { Animated, ImageBackground, StyleSheet, Text, View } from 'react-native'
import { useIsPlaying } from 'react-native-track-player'
import { SCREEN_HEIGHT } from '../CoverFlow/Item'
import { FloatingPlayer } from '../FloatingPlayer'

interface FrostedBackgroundProps {
	source: string
	selected: {
		name: string
		artist: string
	}
	children: React.ReactNode
}

const FrostedBackground: React.FC<FrostedBackgroundProps> = ({ source, selected, children }) => {
	const widthAnimiation = useRef(new Animated.Value(80)).current
	const isPlaying = useIsPlaying()

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
		<View style={styles.container}>
			<ImageBackground source={{ uri: source }} style={styles.imageBackground}>
				<BlurView intensity={90} style={styles.blur}>
					{children}
				</BlurView>
			</ImageBackground>

			<View style={styles.content}>
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
		// ...StyleSheet.absoluteFillObject, // 覆盖在背景上方
		position: 'absolute',
		bottom: SCREEN_HEIGHT * 0.15,
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
