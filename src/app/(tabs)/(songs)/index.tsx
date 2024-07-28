import { TracksList } from '@/components/TracksList'
import { screenPadding } from '@/constants/tokens'
import { trackTitleFilter } from '@/helpers/filter'
import { generateTracksListId } from '@/helpers/miscellaneous'
import { useNavigationSearch } from '@/hooks/useNavigationSearch'
import { useActiveTrack, useLibraryStore } from '@/store/library'
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
	const { queueListWithContent, activeQueueId } = useQueueStore((state) => state)
	const { activeTrackId } = useActiveTrack((state) => state)

	const loadQueue = async () => {
		await TrackPlayer.setQueue(queueListWithContent[activeQueueId])
		await TrackPlayer.skip(activeTrackId || 0)
		init = 1
	}
	useEffect(() => {
		setTracks(tracks)

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
		<View style={defaultStyles.container}>
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
		</View>
	)
}

export default SongsScreen
