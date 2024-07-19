// import React, { useEffect, useRef, useState } from 'react'
// import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native'

// // Define a type for the lyrics prop
// type Lyric = {
// 	time: number
// 	line: string
// 	end?: number
// }

// type LyricsDisplayProps = {
// 	lyrics: Lyric[]
// 	trackPlayer: any
// }

// const LyricsDisplay: React.FC<LyricsDisplayProps> = ({ lyrics, trackPlayer }) => {
// 	const [currentPosition, setCurrentPosition] = useState<number>(0)
// 	const scrollViewRef = useRef<ScrollView>(null)

// 	useEffect(() => {
// 		const checkPosition = () => {
// 			trackPlayer.getCurrentPosition().then((position: number) => {
// 				setCurrentPosition(position)
// 				scrollToCurrentLyric(position)
// 			})
// 		}

// 		const interval = setInterval(checkPosition, 500) // Update more frequently for smoother scrolling

// 		return () => clearInterval(interval)
// 	}, [trackPlayer])

// 	const scrollToCurrentLyric = (position: number) => {
// 		const index = lyrics.findIndex(
// 			(lyric) => lyric.time <= position && position < (lyric.end || lyric.time + 10),
// 		)
// 		if (index !== -1 && scrollViewRef.current) {
// 			// Scroll to keep current lyric in the middle of the view
// 			scrollViewRef.current.scrollTo({ y: index * 60 - 120, animated: true })
// 		}
// 	}

// 	const handleLyricPress = (time: number) => {
// 		trackPlayer.seekTo(time)
// 		scrollToCurrentLyric(time)
// 	}

// 	return (
// 		<ScrollView ref={scrollViewRef} style={styles.scrollView}>
// 			{lyrics.map((lyric, index) => (
// 				<TouchableOpacity key={index} onPress={() => handleLyricPress(lyric.time)}>
// 					<Text
// 						style={[
// 							styles.lyricText,
// 							{
// 								color:
// 									lyric.time <= currentPosition && currentPosition < (lyric.end || lyric.time + 10)
// 										? '#007AFF'
// 										: 'gray', // Highlight color and default color
// 								fontWeight:
// 									lyric.time <= currentPosition && currentPosition < (lyric.end || lyric.time + 10)
// 										? 'bold'
// 										: 'normal', // Bold for current lyric
// 							},
// 						]}
// 					>
// 						{lyric.line}
// 					</Text>
// 				</TouchableOpacity>
// 			))}
// 		</ScrollView>
// 	)
// }

// const styles = StyleSheet.create({
// 	scrollView: {
// 		maxHeight: 300,
// 		backgroundColor: 'white',
// 		borderRadius: 10,
// 		paddingVertical: 20,
// 	},
// 	lyricText: {
// 		fontSize: 16,
// 		padding: 10,
// 		textAlign: 'center',
// 		lineHeight: 24,
// 	},
// })

// export default LyricsDisplay
