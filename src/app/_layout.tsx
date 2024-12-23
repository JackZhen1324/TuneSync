import { playbackService } from '@/constants/playbackService'
import { colors } from '@/constants/tokens'
import { initCacheDirectory } from '@/helpers/cache'
import { debounce } from '@/helpers/debounce'
import { useLogTrackPlayerState } from '@/hooks/useLogTrackPlayerState'
import { useSetupTrackPlayer } from '@/hooks/useSetupTrackPlayer'
import { useLanguageStore } from '@/store/language'
import { useActiveTrack } from '@/store/library'
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
	const { setActiveTrackIndex } = useActiveTrack((state) => state)

	const { language } = useLanguageStore()

	const handleTrackPlayerLoaded = useCallback(() => {
		SplashScreen.hideAsync()
	}, [])
	useSetupTrackPlayer({
		onLoad: handleTrackPlayerLoaded,
	})

	const changeLanguage = (lang: string): void => {
		i18n.changeLanguage(lang)
	}

	useEffect(() => {
		// initialize cache directory
		initCacheDirectory()
		// change language
		changeLanguage(language)
	}, [])

	useTrackPlayerEvents(
		[Event.PlaybackState, Event.PlaybackTrackChanged],
		debounce(async (event: { state: string }) => {
			if (event.state === 'playing') {
				const activeIndex = await TrackPlayer.getActiveTrackIndex()
				setActiveTrackIndex(activeIndex)
			}
		}, 10),
	)
	useLogTrackPlayerState()

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
