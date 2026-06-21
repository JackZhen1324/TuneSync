import { playbackService } from '@/constants/playbackService'
import { colors } from '@/constants/tokens'
import { initCacheDirectory } from '@/helpers/cache'
import { useLogTrackPlayerState } from '@/hooks/useLogTrackPlayerState'
import { useSetupTrackPlayer } from '@/hooks/useSetupTrackPlayer'
import { useLanguageStore } from '@/store/language'
import { useActiveTrack, useLibraryStore } from '@/store/library'
import { useQueueStore } from '@/store/queue'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'intl-pluralrules'
import { useCallback, useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import TrackPlayer from 'react-native-track-player'
import i18n from '../locales/i18n'
SplashScreen.preventAutoHideAsync()

TrackPlayer.registerPlaybackService(() => playbackService)

const App = () => {
	const { language } = useLanguageStore()
	const { setTracks, tracksMap } = useLibraryStore((state) => state)
	const { activeTrack } = useActiveTrack((state) => state)
	const { queueListWithContent } = useQueueStore((state) => state) as { queueListWithContent: any }
	const loadQueue = useCallback(async () => {
		try {
			const queue = queueListWithContent.default
			const activeTrackIndex = queue.findIndex((el) => el.basename === activeTrack) || 0
			await TrackPlayer.setQueue(queue)
			await TrackPlayer.skip(activeTrackIndex)
		} catch (error) {
			console.log('error', error)
		}
	}, [activeTrack, queueListWithContent.default])

	const handleTrackPlayerLoaded = useCallback(() => {
		loadQueue()
		setTracks(tracksMap)
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
					orientation: 'portrait',
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
