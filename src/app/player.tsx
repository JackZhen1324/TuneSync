import LyricsDisplay from '@/components/LyricsDisplay'
import LyricsToggle from '@/components/LyricsToggle'
import { MovingText } from '@/components/MovingText'
import { PlayerControls } from '@/components/PlayerControls'
import { PlayerProgressBar } from '@/components/PlayerProgressbar'
import { PlayerRepeatToggle } from '@/components/PlayerRepeatToggle'
import { PlaylistsList } from '@/components/PlaylistsList'
import PlaylistToggle from '@/components/PlaylistToggle'
import { unknownTrackImageUri } from '@/constants/images'
import { colors, fontSize, screenPadding } from '@/constants/tokens'
import { useLrcLoader } from '@/helpers/LyricLoader'
import CustomBottomSheet from '@/hooks/useBottomView'
import { usePlayerBackground } from '@/hooks/usePlayerBackground'
import { defaultStyles, utilsStyles } from '@/styles'
import { MaterialIcons } from '@expo/vector-icons'
import BottomSheet from '@gorhom/bottom-sheet'
import { LinearGradient } from 'expo-linear-gradient'
import { useEffect, useRef, useState } from 'react'
import {
	showRoutePicker,
	useAirplayConnectivity,
	useAvAudioSessionRoutes,
	useExternalPlaybackAvailability,
} from 'react-airplay'
import { ActivityIndicator, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import Animated, { useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useActiveTrack } from 'react-native-track-player'
const PlayerScreen = () => {
	const activeTrack = useActiveTrack()
	const { height } = useWindowDimensions()
	const { imageColors } = usePlayerBackground(activeTrack?.artwork ?? unknownTrackImageUri)
	const modalRef = useRef<BottomSheet>(null)
	const { top, bottom } = useSafeAreaInsets()

	const { lyrics, loadLrc } = useLrcLoader(activeTrack)
	const [showLyrics, setShowLyrics] = useState(false)
	const headerFlex = useSharedValue(1)
	const titleOpacity = useSharedValue(1)
	const lyricsOpacy = useSharedValue(0)
	const lyricsModeTitleOpacity = useSharedValue(0)
	const titleHeight = useSharedValue(60)
	const lyricsModeTitleHeight = useSharedValue(0)
	const isAirplayConnected = useAirplayConnectivity()
	const isExternalPlaybackAvailable = useExternalPlaybackAvailability()
	const routes = useAvAudioSessionRoutes()
	useEffect(() => {
		if (!activeTrack?.formatedTitle) return

		loadLrc(activeTrack.filename, activeTrack.formatedTitle)
	}, [activeTrack])

	if (!activeTrack) {
		return (
			<View
				style={[
					defaultStyles.container,
					{ justifyContent: 'center', backgroundColor: 'transparent' },
				]}
			>
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

				<View style={{ flex: 1, marginTop: top + 70, marginBottom: bottom }}>
					<Animated.View
						style={[
							styles.artworkImageContainer,
							{
								flex: headerFlex,
								justifyContent: 'space-between',
								alignItems: 'center',
							},
						]}
					>
						<FastImage
							source={{
								uri: activeTrack?.artwork ?? unknownTrackImageUri,
								priority: FastImage.priority.high,
							}}
							resizeMode="cover"
							style={styles.artworkImage}
						/>
						<Animated.View
							style={[
								styles.artworkTitleContainer,
								,
								{
									opacity: lyricsModeTitleOpacity,
									marginLeft: 20,

									height: lyricsModeTitleHeight,
									width: 400,
								},
							]}
						>
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
										text={activeTrack.formatedTitle ?? ''}
										animationThreshold={30}
										style={styles.trackTitleText}
									/>
								</View>
							</View>

							{/* Track artist */}
							{activeTrack.artist && (
								<Text numberOfLines={1} style={[styles.trackArtistText, { marginTop: 6 }]}>
									{activeTrack.artist}
								</Text>
							)}
						</Animated.View>
					</Animated.View>

					<View style={{ flex: 1, justifyContent: 'flex-end' }}>
						{showLyrics && <LyricsDisplay lyrics={lyrics}></LyricsDisplay>}

						<View style={{ flexDirection: 'column' }}>
							<Animated.View
								style={{
									height: titleHeight,
									opacity: titleOpacity,
								}}
							>
								<Animated.View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
										alignItems: 'center',
										display: showLyrics ? 'none' : 'flex',
									}}
								>
									{/* Track title */}
									<View style={styles.trackTitleContainer}>
										<MovingText
											text={activeTrack.formatedTitle ?? ''}
											animationThreshold={30}
											style={styles.trackTitleText}
										/>
									</View>
								</Animated.View>

								{/* Track artist */}
								{activeTrack.artist && (
									<Text
										numberOfLines={1}
										style={[
											styles.trackArtistText,
											{ marginTop: 6, display: showLyrics ? 'none' : 'flex' },
										]}
									>
										{activeTrack.artist}
									</Text>
								)}
							</Animated.View>

							<PlayerProgressBar style={{ marginTop: showLyrics ? 10 : 26 }} />

							<PlayerControls style={{ marginTop: 40 }} />
						</View>

						{/* <PlayerVolumeBar style={{ marginTop: 'auto', marginBottom: 30 }} /> */}

						<View style={utilsStyles.centeredRow}>
							<PlayerRepeatToggle size={30} style={{ marginBottom: 6 }} />
							{isExternalPlaybackAvailable && (
								<MaterialIcons
									onPress={() => showRoutePicker({ prioritizesVideoDevices: true })}
									style={{ marginBottom: 6, flex: 1, textAlign: 'right' }}
									name="airplay"
									size={24}
									color={isAirplayConnected ? colors.primary : 'white'}
								/>
							)}
							<LyricsToggle
								isPlaylistEnable={showLyrics}
								onPress={() => {
									if (!showLyrics) {
										lyricsModeTitleHeight.value = withTiming(60)
										titleHeight.value = withTiming(0)
										lyricsOpacy.value = withSpring(1)
										lyricsModeTitleOpacity.value = withSpring(1)
										titleOpacity.value = withSpring(0)
										headerFlex.value = withSpring(0.12, {
											damping: 20,
										})
									} else {
										lyricsModeTitleHeight.value = withTiming(0)
										titleHeight.value = withTiming(60)
										lyricsOpacy.value = withSpring(0)
										lyricsModeTitleOpacity.value = withSpring(0)
										titleOpacity.value = withSpring(1)
										headerFlex.value = withSpring(1, {
											damping: 20,
										})
									}
									setShowLyrics(!showLyrics)
								}}
							/>
							<PlaylistToggle
								isPlaylistEnable={false}
								onPress={() => {
									modalRef.current.snapToIndex(2)
								}}
							/>
						</View>
						{isAirplayConnected && (
							<View style={styles.footer}>
								<Text>
									{routes.length && (
										<Text style={styles.footerContent}>
											iPhone{` -> `}
											{routes.map((route) => route.portName).join(', ')}
										</Text>
									)}
								</Text>
							</View>
						)}
					</View>
				</View>
			</View>
			<CustomBottomSheet
				onClose={() => {
					if (modalRef.current) {
						modalRef.current.close()
					}
				}}
				modalRef={modalRef}
				content={<PlaylistsList></PlaylistsList>}
			></CustomBottomSheet>
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
	artworkTitleContainer: {
		height: 0,
	},
	overlayContainer: {
		...defaultStyles.container,
		paddingHorizontal: screenPadding.horizontal,
		backgroundColor: 'rgba(0,0,0,0.5)',
	},
	artworkImageContainer: {
		flex: 1,
		shadowOffset: {
			width: 0,
			height: 8,
		},
		width: '100%',
		shadowOpacity: 0.44,
		shadowRadius: 11.0,
		flexDirection: 'row',
		// justifyContent: 'flex-start',
		// height: '49.9%',
		aspectRatio: 1,
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
	footer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	footerContent: {
		color: colors.text,
	},
})

export default PlayerScreen
