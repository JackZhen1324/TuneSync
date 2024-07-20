import LyricsDisplay from '@/components/LyricsDisplay'
import { MovingText } from '@/components/MovingText'
import { PlayerControls } from '@/components/PlayerControls'
import { PlayerProgressBar } from '@/components/PlayerProgressbar'
import { PlayerRepeatToggle } from '@/components/PlayerRepeatToggle'
import { PlayerVolumeBar } from '@/components/PlayerVolumeBar'
import { unknownTrackImageUri } from '@/constants/images'
import { colors, fontSize, screenPadding } from '@/constants/tokens'
import { usePlayerBackground } from '@/hooks/usePlayerBackground'
import { useTrackPlayerFavorite } from '@/hooks/useTrackPlayerFavorite'
import { searchLyricViaNetease, searchSongsViaNetease } from '@/service/neteaseData'
import { defaultStyles, utilsStyles } from '@/styles'
import { FontAwesome } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SceneMap, TabBar, TabView } from 'react-native-tab-view'
import { useActiveTrack } from 'react-native-track-player'

const SongInfoRoute = ({ activeTrack, isFavorite, toggleFavorite }) => (
	<View style={{ flex: 1, marginTop: 40 }}>
		<View style={styles.artworkImageContainer}>
			<FastImage
				source={{
					uri: activeTrack.artwork ?? unknownTrackImageUri,
					priority: FastImage.priority.high,
				}}
				resizeMode="cover"
				style={styles.artworkImage}
			/>
		</View>

		<View style={{ flex: 1 }}>
			<View style={{ marginTop: 'auto' }}>
				<View style={{ height: 60 }}>
					<View
						style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
					>
						{/* Track title */}
						<View style={styles.trackTitleContainer}>
							<MovingText
								text={activeTrack.title ?? ''}
								animationThreshold={30}
								style={styles.trackTitleText}
							/>
						</View>

						{/* Favorite button icon */}
						<FontAwesome
							name={isFavorite ? 'heart' : 'heart-o'}
							size={20}
							color={isFavorite ? colors.primary : colors.icon}
							style={{ marginHorizontal: 14 }}
							onPress={toggleFavorite}
						/>
					</View>

					{/* Track artist */}
					{activeTrack.artist && (
						<Text numberOfLines={1} style={[styles.trackArtistText, { marginTop: 6 }]}>
							{activeTrack.artist}
						</Text>
					)}
				</View>

				<PlayerProgressBar style={{ marginTop: 32 }} />

				<PlayerControls style={{ marginTop: 40 }} />
			</View>

			<PlayerVolumeBar style={{ marginTop: 'auto', marginBottom: 30 }} />

			<View style={utilsStyles.centeredRow}>
				<PlayerRepeatToggle size={30} style={{ marginBottom: 6 }} />
			</View>
		</View>
	</View>
)

const LyricsRoute = ({ lyrics }) => (
	<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
		{/* <Text style={styles.trackTitleText}>这里显示歌词</Text> */}
		<LyricsDisplay lyrics={lyrics} />
	</View>
)

const PlayerScreen = () => {
	const activeTrack = useActiveTrack()

	const { imageColors } = usePlayerBackground(activeTrack?.artwork ?? unknownTrackImageUri)
	const { top, bottom } = useSafeAreaInsets()
	const { isFavorite, toggleFavorite } = useTrackPlayerFavorite()
	const [lyricsInfo, setLyrics] = useState([])
	const [index, setIndex] = useState(0)
	const [routes] = useState([
		{ key: 'songInfo', title: '歌曲' },
		{ key: 'lyrics', title: '歌词' },
	])
	useEffect(() => {
		const params = {
			s: activeTrack?.formatedTitle || '',
		}
		console.log('params', params)

		const parseTime = (timeString) => {
			const [minutes, seconds] = timeString.split(':')
			const [secs, millis] = seconds.split('.')

			return parseInt(minutes) * 60 + parseInt(secs) + parseInt(millis) / 1000
		}
		searchSongsViaNetease(params).then((el) => {
			const id = el?.result?.songs?.[0]?.id
			console.log('id222', id)

			searchLyricViaNetease({ id }).then((lyric) => {
				const raw = lyric?.lrc?.lyric
				const formatedLyric = raw
					.split('\n')
					.map((l) => {
						const regex = /\[([0-9]{2,3}:[0-9]{2,3}\.[0-9]{2,3})\]\s*(.*)/
						const match = l.match(regex)
						if (match) {
							const timestamp = parseTime(match[1])
							const content = match[2]
							return {
								time: timestamp,
								line: content,
							}
						}
					})
					.filter((el) => el)
				setLyrics(formatedLyric)
			})
		})
	}, [activeTrack])

	const renderScene = SceneMap({
		songInfo: () => (
			<SongInfoRoute
				activeTrack={activeTrack}
				isFavorite={isFavorite}
				toggleFavorite={toggleFavorite}
			/>
		),
		lyrics: () => LyricsRoute({ lyrics: lyricsInfo }),
	})

	const renderTabBar = (props) => (
		<TabBar
			{...props}
			indicatorStyle={{ backgroundColor: 'white' }}
			style={{ backgroundColor: 'transparent' }}
			labelStyle={{ color: 'white' }}
		/>
	)

	if (!activeTrack) {
		return (
			<View style={[defaultStyles.container, { justifyContent: 'center' }]}>
				<ActivityIndicator color={colors.icon} />
			</View>
		)
	}

	return (
		<LinearGradient
			style={{ flex: 1 }}
			colors={imageColors ? [imageColors.background, imageColors.primary] : [colors.background]}
		>
			<View style={styles.overlayContainer}>
				<DismissPlayerSymbol />

				<TabView
					navigationState={{ index, routes }}
					renderScene={renderScene}
					onIndexChange={setIndex}
					initialLayout={{ width: Dimensions.get('window').width }}
					renderTabBar={renderTabBar}
					style={{ marginTop: top + 20, marginBottom: top }}
				/>
			</View>
		</LinearGradient>
	)
}

const DismissPlayerSymbol = () => {
	const { top } = useSafeAreaInsets()

	return (
		<View
			style={{
				position: 'absolute',
				top: top + 8,
				left: 0,
				right: 0,
				flexDirection: 'row',
				justifyContent: 'center',
			}}
		>
			<View
				accessible={false}
				style={{
					width: 50,
					height: 8,
					borderRadius: 8,
					backgroundColor: '#fff',
					opacity: 0.7,
				}}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
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

export default PlayerScreen
