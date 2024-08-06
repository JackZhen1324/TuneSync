import { HeaderMemu } from '@/components/headerMenu'
import { StopPropagation } from '@/components/utils/StopPropagation'
import { StackScreenWithSearchBar } from '@/constants/layout'
import { colors } from '@/constants/tokens'
import { debounce } from '@/helpers/debounce'
import { indexingLocal } from '@/helpers/indexing/local'
import { indexingWebdav } from '@/helpers/indexing/webdav'
import useThemeColor from '@/hooks/useThemeColor'
import {
	useActiveTrack,
	useIndexStore,
	useLibraryStore,
	useSpotofyAuthToken,
} from '@/store/library'
import { useQueueStore } from '@/store/queue'
import { defaultStyles } from '@/styles'
import { Entypo } from '@expo/vector-icons'
import { useIsFocused } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Text, View } from 'react-native'
import TrackPlayer from 'react-native-track-player'

const SongsScreenLayout = () => {
	const { t } = useTranslation()
	const isFocused = useIsFocused()
	const { loading, percentage, current, setLoading, indexingList, setNeedUpdate, needUpdate } =
		useIndexStore()
	const { token, setToken } = useSpotofyAuthToken()

	const { setTracks, tracks } = useLibraryStore((state) => state)
	const { setActiveTrack, activeTrack } = useActiveTrack((state) => state)
	const theme = useThemeColor()
	const { setActiveQueueId, activeQueueId, queueListWithContent, setQueueListContent } =
		useQueueStore((state) => state)
	const refresh = useCallback(() => {
		setTracks(tracks)
		setActiveQueueId(activeQueueId)
	}, [activeQueueId, setActiveQueueId, setTracks, tracks])
	const refreshLibrary = useCallback(async () => {
		try {
			const localIndexing = indexingList.filter((el) => el.from === 'local')
			const webdavIndexing = indexingList.filter((el) => el.from !== 'local')

			const localMusices = await indexingLocal(localIndexing, setLoading, refresh, token)

			const webdavMusices = await indexingWebdav(webdavIndexing, setLoading, refresh, token)

			const musicTotal = [...localMusices, ...webdavMusices]
			const songTitles = musicTotal.map((el) => el.title)

			const filteredQueue = queueListWithContent[activeQueueId].filter((el) => {
				return songTitles.includes(el.title)
			})
			if (!songTitles.includes(activeTrack.title)) {
				setActiveTrack(undefined)
			}
			setTracks(musicTotal)
			setQueueListContent(filteredQueue, activeQueueId, queueListWithContent)
			await TrackPlayer.setQueue(filteredQueue)
			setNeedUpdate(false)
		} catch (error) {
			console.log('error', error)

			setLoading({ loading: false, percentage: 0, current: '' })
			setNeedUpdate(false)
		}
	}, [
		activeQueueId,
		activeTrack,
		indexingList,
		queueListWithContent,
		refresh,
		setActiveTrack,
		setLoading,
		setNeedUpdate,
		setQueueListContent,
		setTracks,
		token,
	])
	const debouncedRefreshLibrary = useCallback(debounce(refreshLibrary, 300), [refreshLibrary])
	useEffect(() => {
		setLoading({ loading: false, percentage: 0, current: '' })
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
