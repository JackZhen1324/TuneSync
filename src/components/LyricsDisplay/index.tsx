import { fontSize, screenPadding } from '@/constants/tokens'
import { defaultStyles } from '@/styles'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import TrackPlayer from 'react-native-track-player'
import { PlayerControls } from '../PlayerControls'
import { PlayerProgressBar } from '../PlayerProgressbar'
type LyricsDisplayProps = {
	lyrics: any
}

const LyricsDisplay: React.FC<LyricsDisplayProps> = ({ lyrics }) => {
	const scrollViewRef = useRef<ScrollView>(null)

	const [currentPosition, setCurrentPosition] = useState<number>(0)
	const [isManualScroll, setIsManualScroll] = useState(false)

	const scrollToCurrentLyric = useCallback(
		(position: number) => {
			const index = lyrics.findIndex(
				(lyric: { time: number }) => lyric.time <= position && position < lyric.time + 10,
			)
			if (index !== -1 && scrollViewRef.current) {
				scrollViewRef.current.scrollTo({ y: index * 45 - 150, animated: true })
			}
		},
		[lyrics],
	)
	useEffect(() => {
		const checkPosition = async () => {
			const position = await TrackPlayer.getPosition()
			setCurrentPosition(position)
			if (!isManualScroll) {
				scrollToCurrentLyric(position)
			}
		}

		const interval = setInterval(checkPosition, 300)
		return () => {
			clearInterval(interval)
			clearTimeout('')
		}
	}, [lyrics, isManualScroll, scrollToCurrentLyric])
	const handleScrollBegin = () => {
		setIsManualScroll(true)
	}

	const handleScrollEnd = () => {
		setTimeout(() => setIsManualScroll(false), 2000)
	}

	const handleLyricPress = (time: number) => {
		TrackPlayer.seekTo(time)
		scrollToCurrentLyric(time)
	}
	if (lyrics?.length > 0) {
		return (
			<>
				<ScrollView
					onScrollBeginDrag={handleScrollBegin}
					onScrollEndDrag={handleScrollEnd}
					// onMomentumScrollEnd={handleScrollEnd}
					ref={scrollViewRef}
					style={styles.scrollView}
				>
					{lyrics.map(
						(
							lyric: {
								time: number
								line:
									| string
									| number
									| boolean
									| React.ReactElement<any, string | React.JSXElementConstructor<any>>
									| Iterable<React.ReactNode>
									| React.ReactPortal
									| null
									| undefined
							},
							index: number,
						) => (
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
						),
					)}
				</ScrollView>
				<View style={styles.controlerContainer}>
					<View style={{ marginTop: 'auto' }}>
						<PlayerProgressBar style={{ marginTop: 32 }} />

						<PlayerControls style={{ marginTop: 40 }} />
					</View>
				</View>
			</>
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
	controlerContainer: {
		height: 100,
		width: '100%',
	},
	scrollView: {
		flex: 1,
		marginBottom: 40,
		width: '100%',
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
	overlayContainer: {
		...defaultStyles.container,
		paddingHorizontal: screenPadding.horizontal,
		backgroundColor: 'rgba(0,0,0,0.5)',
	},
	header: {
		display: 'flex',
		justifyContent: 'center',
		color: 'white',
	},
	artworkImageContainer: {
		shadowOffset: {
			width: 0,
			height: 8,
		},
		shadowOpacity: 0.44,
		shadowRadius: 11.0,
		flexDirection: 'row',
		justifyContent: 'center',
		height: '45%',
	},
	artworkImage: {
		width: '100%',
		height: '100%',
		resizeMode: 'cover',
		borderRadius: 12,
	},
	trackTitleContainer: {
		flex: 1,
		overflow: 'hidden',
	},
	trackTitleText: {
		...defaultStyles.text,
		fontSize: 22,
		fontWeight: '700',
	},
	trackArtistText: {
		...defaultStyles.text,
		fontSize: fontSize.base,
		opacity: 0.8,
		maxWidth: '90%',
	},
})

export default LyricsDisplay
