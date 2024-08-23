import LyricsDisplay from '@/components/LyricsDisplay'
import { MovingText } from '@/components/MovingText'
import { PlayerControls } from '@/components/PlayerControls'
import { PlayerProgressBar } from '@/components/PlayerProgressbar'
import { PlayerRepeatToggle } from '@/components/PlayerRepeatToggle'
import { PlayerVolumeBar } from '@/components/PlayerVolumeBar'
import { PlaylistsList } from '@/components/PlaylistsList'
import PlaylistToggle from '@/components/PlaylistToggle'
import { unknownTrackImageUri } from '@/constants/images'
import { colors, fontSize, screenPadding } from '@/constants/tokens'
import useModalView from '@/hooks/useModalView'
import { usePlayerBackground } from '@/hooks/usePlayerBackground'
import { searchLyricViaNetease, searchSongsViaNetease } from '@/service/neteaseData'
import { useActiveTrack, useFavorateStore } from '@/store/library'
import { defaultStyles, utilsStyles } from '@/styles'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useMemo, useState } from 'react'
import {
	showRoutePicker,
	useAirplayConnectivity,
	useAvAudioSessionRoutes,
	useExternalPlaybackAvailability,
} from 'react-airplay'
import { useTranslation } from 'react-i18next'
import {
	ActivityIndicator,
	Dimensions,
	PressableAndroidRippleConfig,
	StyleProp,
	StyleSheet,
	Text,
	TextStyle,
	View,
	ViewStyle,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
	NavigationState,
	Route,
	SceneRendererProps,
	TabBar,
	TabBarIndicatorProps,
	TabBarItemProps,
	TabView,
} from 'react-native-tab-view'
import { Event, Scene } from 'react-native-tab-view/lib/typescript/src/types'

const SongInfoRoute = ({ activeTrack, togglePlaylist, setIndex }: any) => {
	const isAirplayConnected = useAirplayConnectivity()
	const isExternalPlaybackAvailable = useExternalPlaybackAvailability()
	const routes = useAvAudioSessionRoutes()

	const { favorateTracks, addTracks, setFavorateTracks } = useFavorateStore()
	const isFavorite = useMemo(() => {
		if (activeTrack) {
			return favorateTracks.some((el: { title: any }) => el.title === activeTrack.title)
		}
		return false
	}, [activeTrack, favorateTracks])
	if (!activeTrack) {
		return (
			<View style={[defaultStyles.container, { justifyContent: 'center' }]}>
				<ActivityIndicator color={colors.icon} />
			</View>
		)
	}
	return (
		<View style={{ flex: 1, marginTop: 40 }}>
			<View style={styles.artworkImageContainer}>
				<FastImage
					source={{
						uri: activeTrack?.artwork ?? unknownTrackImageUri,
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
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}
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
								onPress={() => {
									if (isFavorite) {
										setFavorateTracks(
											favorateTracks.filter((el: { title: string | undefined }) => {
												return el.title !== activeTrack.title
											}),
										)
									} else {
										addTracks(activeTrack, favorateTracks)
									}
								}}
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
					<PlayerRepeatToggle size={30} style={{ marginBottom: 6, flex: 1 }} />
					{isExternalPlaybackAvailable && (
						<MaterialIcons
							onPress={() => showRoutePicker({ prioritizesVideoDevices: true })}
							style={{ marginBottom: 6, flex: 1, textAlign: 'center' }}
							name="airplay"
							size={24}
							color={isAirplayConnected ? colors.primary : 'white'}
						/>
					)}
					<PlaylistToggle isPlaylistEnable={false} onPress={togglePlaylist} />
				</View>
				{isAirplayConnected && (
					<View style={styles.footer}>
						<Text>
							{routes.length && (
								<Text style={styles.footer.content}>
									iPhone{` -> `}
									{routes.map((route) => route.portName).join(', ')}
								</Text>
							)}
						</Text>
					</View>
				)}
			</View>
		</View>
	)
}

const LyricsRoute = ({ lyrics }: any) => (
	<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
		<LyricsDisplay lyrics={lyrics} />
	</View>
)

const PlayerScreen = () => {
	const { activeTrack, activeTrackObj } = useActiveTrack()
	const { imageColors } = usePlayerBackground(activeTrackObj?.artwork ?? unknownTrackImageUri)
	const { top, bottom } = useSafeAreaInsets()
	const [lyricsInfo, setLyrics] = useState([])
	const [index, setIndex] = useState(0)
	const { t } = useTranslation()
	const [routes] = useState([
		{ key: 'songInfo', title: t('player.tabs.song') },
		{ key: 'lyrics', title: t('player.tabs.lyric') },
	])
	// const panelRef = useRef(null)
	const [panelRef, render] = useModalView({
		content: () => {
			return <PlaylistsList />
		},
	})
	useEffect(() => {
		if (!activeTrackObj?.formatedTitle) return
		const params = {
			s: activeTrackObj?.formatedTitle || '',
		}
		const parseTime = (timeString: { split: (arg0: string) => [any, any] }) => {
			const [minutes, seconds] = timeString.split(':')
			const [secs, millis] = seconds.split('.')

			return parseInt(minutes) * 60 + parseInt(secs) + parseInt(millis || 0) / 1000
		}
		searchSongsViaNetease(params).then((el) => {
			const id = el?.result?.songs?.[0]?.id

			searchLyricViaNetease({ id }).then((lyric) => {
				const raw = lyric?.lrc?.lyric
				const formatedLyric = raw
					.split('\n')
					.map((l: string) => {
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
					.filter((el: any) => el)
				setLyrics(formatedLyric)
			})
		})
	}, [activeTrackObj])

	const renderScene = ({ route }) => {
		switch (route.key) {
			case 'songInfo':
				return (
					<SongInfoRoute
						setIndex={setIndex}
						activeTrack={activeTrackObj}
						togglePlaylist={() => panelRef.current.show()}
					/>
				)
			case 'lyrics':
				return LyricsRoute({ lyrics: lyricsInfo })
			default:
				return null
		}
	}

	const renderTabBar = (
		props: React.JSX.IntrinsicAttributes &
			SceneRendererProps & {
				navigationState: NavigationState<Route>
				scrollEnabled?: boolean
				bounces?: boolean
				activeColor?: string
				inactiveColor?: string
				pressColor?: string
				pressOpacity?: number
				getLabelText?: ((scene: Scene<Route>) => string | undefined) | undefined
				getAccessible?: ((scene: Scene<Route>) => boolean | undefined) | undefined
				getAccessibilityLabel?: ((scene: Scene<Route>) => string | undefined) | undefined
				getTestID?: ((scene: Scene<Route>) => string | undefined) | undefined
				renderLabel?:
					| ((scene: Scene<Route> & { focused: boolean; color: string }) => React.ReactNode)
					| undefined
				renderIcon?:
					| ((scene: Scene<Route> & { focused: boolean; color: string }) => React.ReactNode)
					| undefined
				renderBadge?: ((scene: Scene<Route>) => React.ReactNode) | undefined
				renderIndicator?: ((props: TabBarIndicatorProps<Route>) => React.ReactNode) | undefined
				renderTabBarItem?:
					| ((props: TabBarItemProps<Route> & { key: string }) => React.ReactElement)
					| undefined
				onTabPress?: ((scene: Scene<Route> & Event) => void) | undefined
				onTabLongPress?: ((scene: Scene<Route>) => void) | undefined
				tabStyle?: StyleProp<ViewStyle>
				indicatorStyle?: StyleProp<ViewStyle>
				indicatorContainerStyle?: StyleProp<ViewStyle>
				labelStyle?: StyleProp<TextStyle>
				contentContainerStyle?: StyleProp<ViewStyle>
				style?: StyleProp<ViewStyle>
				gap?: number
				testID?: string
				android_ripple?: PressableAndroidRippleConfig
			},
	) => (
		<TabBar
			{...props}
			indicatorStyle={{ backgroundColor: 'white' }}
			style={{ backgroundColor: 'transparent' }}
			labelStyle={{ color: 'white' }}
		/>
	)

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
			{render()}
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
	panelContainer: {
		flex: 1,
		// backgroundColor: 'white',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		padding: 16,
	},
	panelTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: 'white',
		paddingVertical: 8,
		// paddingHorizontal: 16,
		paddingLeft: 8,
		marginBottom: 16,
	},
	closeButton: {
		// marginTop: 16,
		// backgroundColor: colors.primary,
		borderRadius: 8,
		paddingVertical: 8,
		paddingHorizontal: 16,
		paddingRight: 8,
		alignSelf: 'center',
	},
	closeButtonText: {
		color: 'white',
		fontSize: 16,
	},
	footer: {
		justifyContent: 'center',
		alignItems: 'center',

		content: {
			color: colors.text,
		},
	},
})

export default PlayerScreen
