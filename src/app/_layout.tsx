import { playbackService } from '@/constants/playbackService'
import { colors } from '@/constants/tokens'
import { initCacheDirectory, reCached } from '@/helpers/cache'
import { debounce } from '@/helpers/debounce'
import { useLogTrackPlayerState } from '@/hooks/useLogTrackPlayerState'
import { useSetupTrackPlayer } from '@/hooks/useSetupTrackPlayer'
import { useLanguageStore } from '@/store/language'
import { useActiveTrack, useLibraryStore } from '@/store/library'
import { usePlayerStore } from '@/store/player'
import { useQueueStore } from '@/store/queue'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'intl-pluralrules'
import { useCallback, useEffect } from 'react'
import RNFS from 'react-native-fs'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import TrackPlayer, { Event, useTrackPlayerEvents } from 'react-native-track-player'
import i18n from '../locales/i18n'
SplashScreen.preventAutoHideAsync()

TrackPlayer.registerPlaybackService(() => playbackService)

const App = () => {
	const { setActiveTrackIndex } = useActiveTrack((state) => state)
	const { language } = useLanguageStore()
	const { setTracks, tracksMap } = useLibraryStore((state) => state)
	const { activeTrack } = useActiveTrack((state) => state)
	const { queueListWithContent } = useQueueStore((state) => state) as { queueListWithContent: any }
	const { cacheResetTrigger, fireCacheResetTrigger } = usePlayerStore((state) => state)
	const loadQueue = useCallback(async () => {
		try {
			const queue = queueListWithContent.default
			const activeTrackIndex = queue.findIndex((el) => el.basename === activeTrack) || 0
			const previousIndex = activeTrackIndex - 1 > -1 ? activeTrackIndex - 1 : queue.length - 1
			const nextIndex = activeTrackIndex + 1 < queue.length ? activeTrackIndex + 1 : 0
			const pendingRecache = [queue[activeTrackIndex], queue[previousIndex], queue[nextIndex]]
			pendingRecache.forEach(async (el) => {
				const fileExtension = el.basename.split('.').pop() || ''
				const fileName = `${el.basename}.${fileExtension}`
				const filePath = `${RNFS.DocumentDirectoryPath}/music_cache/${fileName}`
				await reCached(el.originalUrl, el.basename, filePath)
			})
			await TrackPlayer.setQueue(queue)
			await TrackPlayer.skip(activeTrackIndex)
		} catch (error) {
			console.log('error', error)
		}
	}, [activeTrack, queueListWithContent.default])
	useEffect(() => {
		if (cacheResetTrigger) {
			const queue = queueListWithContent.default
			const activeTrackIndex = queue.findIndex((el) => el.basename === activeTrack) || 0
			const previousIndex = activeTrackIndex - 1 > -1 ? activeTrackIndex - 1 : queue.length - 1
			const nextIndex = activeTrackIndex + 1 < queue.length ? activeTrackIndex + 1 : 0
			const pendingRecache = [queue[activeTrackIndex], queue[previousIndex], queue[nextIndex]]
			pendingRecache.forEach(async (el) => {
				const fileExtension = el.basename.split('.').pop() || ''
				const fileName = `${el.basename}.${fileExtension}`
				const filePath = `${RNFS.DocumentDirectoryPath}/music_cache/${fileName}`
				await reCached(el.originalUrl, el.basename, filePath)
			})
			fireCacheResetTrigger()
		}
	}, [
		activeTrack,
		cacheResetTrigger,
		fireCacheResetTrigger,
		loadQueue,
		queueListWithContent.default,
	])
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

	useTrackPlayerEvents(
		[Event.PlaybackState, Event.PlaybackTrackChanged],
		debounce(async (event: { state: string }) => {
			if (event.state === 'playing') {
				const activeIndex = await TrackPlayer.getActiveTrackIndex()
				setActiveTrackIndex(activeIndex)
			}
		}, 10),
	)
	useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async (event) => {
		const { index = 0 } = event
		const queue = await TrackPlayer.getQueue()
		const previousIndex = index - 1 > -1 ? index - 1 : queue.length - 1
		const nextIndex = index + 1 < queue.length ? index + 1 : 0
		const pendingRecache = [queue[previousIndex], queue[index], queue[nextIndex]]
		pendingRecache.forEach(async (el) => {
			await reCached(el.originalUrl, el.basename, el.cachedUrl)
		})
	})
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
