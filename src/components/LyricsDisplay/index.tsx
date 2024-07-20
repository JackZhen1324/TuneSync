import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import TrackPlayer from 'react-native-track-player'

type LyricsDisplayProps = {
	lyrics: any
}

const LyricsDisplay: React.FC<LyricsDisplayProps> = ({ lyrics }) => {
	const scrollViewRef = useRef<ScrollView>(null)

	const [currentPosition, setCurrentPosition] = useState<number>(0)

	useEffect(() => {
		const checkPosition = async () => {
			const position = await TrackPlayer.getPosition()
			setCurrentPosition(position)
			scrollToCurrentLyric(position)
		}

		const interval = setInterval(checkPosition, 500)
		return () => clearInterval(interval)
	}, [lyrics])

	const scrollToCurrentLyric = (position: number) => {
		const index = lyrics.findIndex((lyric) => lyric.time <= position && position < lyric.time + 10)
		if (index !== -1 && scrollViewRef.current) {
			scrollViewRef.current.scrollTo({ y: index * 45 - 150, animated: true })
		}
	}

	const handleLyricPress = (time: number) => {
		TrackPlayer.seekTo(time)
		scrollToCurrentLyric(time)
	}
	if (lyrics?.length > 0) {
		return (
			<ScrollView ref={scrollViewRef} style={styles.scrollView}>
				{lyrics.map((lyric, index) => (
					<TouchableOpacity key={index} onPress={() => handleLyricPress(lyric.time)}>
						<Text
							style={[
								styles.lyricText,
								{
									color:
										lyric.time <= currentPosition &&
										currentPosition < (lyrics[index + 1]?.time || lyric.time + 10)
											? 'white'
											: 'gray',
									fontWeight:
										lyric.time <= currentPosition &&
										currentPosition < (lyrics[index + 1]?.time || lyric.time + 10)
											? 'bold'
											: 'normal',
								},
							]}
						>
							{lyric.line}
						</Text>
					</TouchableOpacity>
				))}
			</ScrollView>
		)
	}
	return (
		<View>
			<Text
				style={{
					color: 'white',
				}}
			>
				暂无歌词
			</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
		backgroundColor: 'transparent',
		borderRadius: 10,
		paddingVertical: 20,
	},
	lyricText: {
		fontSize: 16,
		padding: 10,
		textAlign: 'center',
		lineHeight: 24,
	},
})

export default LyricsDisplay
