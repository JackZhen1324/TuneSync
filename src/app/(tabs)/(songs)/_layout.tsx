import { HeaderMemu } from '@/components/headerMenu'
import { StopPropagation } from '@/components/utils/StopPropagation'
import { StackScreenWithSearchBar } from '@/constants/layout'
import { colors } from '@/constants/tokens'
import { debounce } from '@/helpers/debounce'
import { indexingLocal } from '@/helpers/indexing/local'
import { fetchMetadata } from '@/helpers/indexing/metadata'
import { indexingWebdav } from '@/helpers/indexing/webdav'
import useThemeColor from '@/hooks/useThemeColor'
import { useActiveTrack, useIndexStore, useLibraryStore } from '@/store/library'
import { useQueueStore } from '@/store/queue'
import { defaultStyles } from '@/styles'
import { Entypo } from '@expo/vector-icons'
import { useIsFocused } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Text, View } from 'react-native'
import TrackPlayer from 'react-native-track-player'
let currentAbortController: AbortController | null = null
const SongsScreenLayout = () => {
	const { t } = useTranslation()
	const isFocused = useIsFocused()
	const { loading, current, setLoading, indexingList, setNeedUpdate, needUpdate } = useIndexStore()
	const { setTracks, tracks, tracksMap, update, cache } = useLibraryStore((state: any) => state)
	const { setActiveTrack, activeTrack } = useActiveTrack((state: any) => state)
	const theme = useThemeColor()
	const {
		setActiveQueueId,
		activeQueueId,
		queueListWithContent,
		setQueueListContent,
		updateQueue,
	} = useQueueStore((state: any) => state)
	const refresh = useCallback(() => {
		setTracks(tracksMap)
		setActiveQueueId(activeQueueId)
	}, [activeQueueId, setActiveQueueId, setTracks, tracksMap])
	const refreshLibrary = useCallback(async () => {
		try {
			// 如果之前的请求存在且未完成，取消它
			if (currentAbortController) {
				console.log('abording')
				currentAbortController.abort()
			}
			// 创建一个新的 AbortController
			currentAbortController = new AbortController()
			const signal = currentAbortController.signal
			setLoading({ loading: true, percentage: 0, current: '' })
			const localIndexing = indexingList.filter((el: { from: string }) => el.from === 'local')
			const webdavIndexing = indexingList.filter((el: { from: string }) => el.from !== 'local')
			const start = performance.now()
			const localMusices = await indexingLocal(localIndexing, refresh)
			const webdavMusices = await indexingWebdav(webdavIndexing, refresh)

			setLoading({
				loading: false,
				percentage: 100,
				current: '',
			})
			const musicTotal = [...localMusices, ...webdavMusices]

			const formatedMusicTotal = {} as any
			const songTitles = musicTotal?.map((el) => {
				const { title } = el
				el.pendingMeta = true
				formatedMusicTotal[title] = el
				return title
			})

			const filteredQueue = queueListWithContent[activeQueueId]
				?.map((el: { formatedTitle: string }, index: number) => {
					return songTitles.includes(el.formatedTitle) ? -1 : index
				})
				?.filter((el: number) => el > -1)
			if (!songTitles.includes(activeTrack.title)) {
				setActiveTrack(undefined)
			}

			setTracks(formatedMusicTotal)
			setQueueListContent(
				queueListWithContent[activeQueueId]?.filter(
					(_el: any, index: any) => !filteredQueue.includes(index),
				),
				activeQueueId,
				queueListWithContent,
			)
			const end = performance.now()
			console.log('cost is', `${end - start}ms`)
			await TrackPlayer.remove(filteredQueue)
			for (const [i, el] of musicTotal.entries()) {
				const { title } = el
				if (signal.aborted) {
					return undefined
				}

				// Clear the abort controller at the last iteration
				if (i === musicTotal.length - 1) {
					currentAbortController = null
				}

				try {
					// Fetch metadata and await it
					const meta = await fetchMetadata({ title, webdavUrl: el.url }, signal, cache)

					if (!signal.aborted) {
						update(el.title, meta)
						updateQueue(el.title, meta, setActiveTrack)
					}
				} catch (error) {
					console.error(`Error fetching metadata for ${title}:`, error)
				}
			}

			setNeedUpdate(false)
		} catch (error) {
			console.log('error', error)

			setLoading({ loading: false, percentage: 0, current: '' })
			setNeedUpdate(false)
		}
	}, [
		activeQueueId,
		activeTrack.title,
		cache,
		indexingList,
		queueListWithContent,
		refresh,
		setActiveTrack,
		setLoading,
		setNeedUpdate,
		setQueueListContent,
		setTracks,
		update,
		updateQueue,
	])
	const debouncedRefreshLibrary = useCallback(debounce(refreshLibrary, 0), [refreshLibrary])

	useEffect(() => {
		currentAbortController = new AbortController()
		const signal = currentAbortController.signal
		setLoading({ loading: false, percentage: 0, current: '' })
		const resumeMetadaExtration = async () => {
			for (const [i, el] of tracks.entries()) {
				const { title, pendingMeta } = el
				if (!pendingMeta) {
					continue
				}
				if (signal.aborted) {
					return undefined
				}

				// Clear the abort controller at the last iteration
				if (i === tracks.length - 1) {
					currentAbortController = null
				}

				try {
					// Fetch metadata and await it
					const meta = await fetchMetadata({ title, webdavUrl: el.url }, signal, cache)

					if (!signal.aborted) {
						update(el.title, meta)
						updateQueue(el.title, meta)
					}
				} catch (error) {
					console.error(`Error fetching metadata for ${title}:`, error)
				}
			}
		}
		resumeMetadaExtration()
	}, [])

	useEffect(() => {
		if (isFocused && needUpdate) {
			try {
				debouncedRefreshLibrary()
				setNeedUpdate(false)
			} catch (error) {
				console.log('error', error)
			}
		}
	}, [needUpdate, debouncedRefreshLibrary, isFocused, setNeedUpdate])
	return (
		<View style={defaultStyles.container}>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						...StackScreenWithSearchBar,
						headerLargeTitle: true,
						headerTitle: t('songs.header'),
						headerRight: () => {
							return (
								<StopPropagation>
									{loading ? (
										<View>
											<ActivityIndicator
												style={{
													position: 'absolute',
													right: 0,
												}}
												size="small"
											/>
											<Text
												style={{
													color: theme.colors.text,
													fontSize: 12,
													position: 'absolute',
													right: 0,
													top: 24,
												}}
											>
												{current}
											</Text>
										</View>
									) : (
										<HeaderMemu refreshLibrary={refreshLibrary}>
											<Entypo name="dots-three-horizontal" size={18} color={colors.icon} />
										</HeaderMemu>
									)}
								</StopPropagation>
							)
						},
					}}
				/>
			</Stack>
		</View>
	)
}

export default SongsScreenLayout
