import { TracksList } from '@/components/TracksList'
import { screenPadding } from '@/constants/tokens'
import { trackTitleFilter } from '@/helpers/filter'
import { generateTracksListId } from '@/helpers/miscellaneous'
import { useNavigationSearch } from '@/hooks/useNavigationSearch'
import { useLibraryStore } from '@/store/library'
import { useQueueStore } from '@/store/queue'
import { defaultStyles } from '@/styles'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native'
import TrackPlayer from 'react-native-track-player'
let init = 0
const SongsScreen = () => {
	const { t } = useTranslation()
	const search = useNavigationSearch({
		searchBarOptions: {
			placeholder: t('songs.search'),
		},
	})

	const { setTracks, tracks, tracksMap } = useLibraryStore((state) => state)
	const { queueListWithContent, activeQueueId } = useQueueStore((state) => state)
	const loadQueue = async () => {
		await TrackPlayer.setQueue(queueListWithContent[activeQueueId])
		init = 1
	}
	useEffect(() => {
		setTracks(tracksMap)
		return () => {}
	}, [])
	useEffect(() => {
		if (init === 0) {
			loadQueue()
		}
	})

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
