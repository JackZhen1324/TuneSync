import { playbackService } from '@/constants/playbackService'
import { colors } from '@/constants/tokens'
import { debounce } from '@/helpers/debounce'
import { useLogTrackPlayerState } from '@/hooks/useLogTrackPlayerState'
import { useSetupTrackPlayer } from '@/hooks/useSetupTrackPlayer'
import { getAccessToken } from '@/service/auth'
import { useLanguageStore } from '@/store/language'
import { useActiveTrack, useSpotofyAuthToken } from '@/store/library'
import { useRequest } from 'ahooks'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'intl-pluralrules'
import { useCallback, useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import TrackPlayer, { Event, useTrackPlayerEvents } from 'react-native-track-player'
import i18n from '../locales/i18n'

SplashScreen.preventAutoHideAsync()

TrackPlayer.registerPlaybackService(() => playbackService)

const App = () => {
	const { setActiveTrack } = useActiveTrack((state) => state)
	const { language } = useLanguageStore()

	const handleTrackPlayerLoaded = useCallback(() => {
		SplashScreen.hideAsync()
	}, [])
	useSetupTrackPlayer({
		onLoad: handleTrackPlayerLoaded,
	})

	const changeLanguage = (lang) => {
		i18n.changeLanguage(lang)
	}
	useEffect(() => {
		changeLanguage(language)
	}, [])
	const { setToken } = useSpotofyAuthToken()
	const { runAsync } = useRequest(getAccessToken, {
		manual: true,
	})
	useEffect(() => {
		runAsync().then((el) => {
			setToken(`${el.token_type} ${el.access_token}`)
		})
	}, [])

	useLogTrackPlayerState()
	useTrackPlayerEvents(
		[Event.PlaybackState, Event.PlaybackTrackChanged],
		debounce(async (event: { state: string }) => {
			if (event.state === 'playing') {
				const track = await TrackPlayer.getActiveTrack()
				const activeIndex = await TrackPlayer.getActiveTrackIndex()
				setActiveTrack(track, activeIndex)
			}
		}, 10),
	)
	return (
		<SafeAreaProvider>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<RootNavigation />

				<StatusBar style="auto" />
			</GestureHandlerRootView>
		</SafeAreaProvider>
	)
}

const RootNavigation = () => {
	return (
		<Stack>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />

			<Stack.Screen
				name="player"
				options={{
					presentation: 'card',
					gestureEnabled: true,
					gestureDirection: 'vertical',
					animationDuration: 400,
					headerShown: false,
				}}
			/>

			<Stack.Screen
				name="(modals)/addToPlaylist"
				options={{
					presentation: 'modal',
					headerStyle: {
						backgroundColor: colors.background,
					},
					headerTitle: 'Add to playlist',
					headerTitleStyle: {
						color: colors.text,
					},
				}}
			/>
		</Stack>
	)
}

export default App
