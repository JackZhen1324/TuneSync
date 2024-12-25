import { TracksList } from '@/components/TracksList'
import { screenPadding } from '@/constants/tokens'
import { trackTitleFilter } from '@/helpers/filter'
import { generateTracksListId } from '@/helpers/miscellaneous'
import { useNavigationSearch } from '@/hooks/useNavigationSearch'
import { useActiveTrack, useLibraryStore } from '@/store/library'
import { useQueueStore } from '@/store/queue'
import { defaultStyles } from '@/styles'
import { useEffect, useLayoutEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'
import TrackPlayer from 'react-native-track-player'

const SongsScreen = () => {
	const { t } = useTranslation()
	const search = useNavigationSearch({
		searchBarOptions: {
			placeholder: t('songs.search'),
		},
	})

	const { setTracks, tracks, tracksMap } = useLibraryStore((state) => state)
	const { activeTrack } = useActiveTrack((state) => state)
	const { queueListWithContent } = useQueueStore((state) => state) as { queueListWithContent: any }
	const loadQueue = async () => {
		try {
			const queue = queueListWithContent.default
			const activeTrackId = queue.findIndex((el) => el.basename === activeTrack) || 0
			await TrackPlayer.setQueue(queue)
			await TrackPlayer.skip(activeTrackId)
		} catch (error) {
			console.log('error', error)
		}
	}
	useLayoutEffect(() => {
		// wait for player to be ready
		const a = setTimeout(() => {
			loadQueue()
		}, 0)
		return () => {
			clearTimeout(a)
		}
	}, [])
	useEffect(() => {
		setTracks(tracksMap)
	}, [])

	const filteredTracks = useMemo(() => {
		if (!search) return tracks

		return tracks.filter(trackTitleFilter(search))
	}, [search, tracks])

	return (
		<SafeAreaView style={defaultStyles.container}>
			<TracksList
				style={{
					paddingHorizontal: screenPadding.horizontal,
					// paddingTop: search ? 20 : 200,
				}}
				id={generateTracksListId('songs', search)}
				tracks={filteredTracks}
				scrollEnabled={true}
				search={search}
			/>
		</SafeAreaView>
	)
}

export default SongsScreen
