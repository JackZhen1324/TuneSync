import { TracksList } from '@/components/TracksList'
import { screenPadding } from '@/constants/tokens'
import { trackTitleFilter } from '@/helpers/filter'
import { generateTracksListId } from '@/helpers/miscellaneous'
import usePaganation from '@/helpers/usePaganation'
import { useNavigationSearch } from '@/hooks/useNavigationSearch'
import { useLibraryStore } from '@/store/library'
import { useQueueStore } from '@/store/queue'
import { defaultStyles } from '@/styles'
import { useEffect, useMemo } from 'react'
import { View } from 'react-native'
import TrackPlayer from 'react-native-track-player'
let init = 0
const SongsScreen = () => {
	const search = useNavigationSearch({
		searchBarOptions: {
			placeholder: 'Find in songs',
		},
	})

	const { setTracks, tracks } = useLibraryStore((state) => state)

	const [data, setPage, currentPage] = usePaganation({ data: tracks })
	const { queueListWithContent, activeQueueId } = useQueueStore((state) => state)

	const loadQueue = async () => {
		await TrackPlayer.setQueue(queueListWithContent[activeQueueId])
		init = 1
	}
	useEffect(() => {
		setTracks()

		return () => {}
	}, [])
	useEffect(() => {
		if (init === 0) {
			loadQueue()
		}
	})

	// console.log(
	// 	'queueListWithContent',
	// 	queueListWithContent[activeQueueId].map((el) => el.title),
	// )

	const filteredTracks = useMemo(() => {
		if (!search) return tracks

		return tracks.filter(trackTitleFilter(search))
	}, [search, tracks])

	return (
		<View style={defaultStyles.container}>
			<TracksList
				setPage={setPage}
				currentPage={currentPage}
				style={{
					paddingHorizontal: screenPadding.horizontal,
					// paddingTop: search ? 20 : 200,
				}}
				id={generateTracksListId('songs', search)}
				tracks={filteredTracks}
				scrollEnabled={true}
				search={search}
			/>
		</View>
	)
}

export default SongsScreen
