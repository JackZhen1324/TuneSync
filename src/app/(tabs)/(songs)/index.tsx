import { TracksList } from '@/components/TracksList'
import { screenPadding } from '@/constants/tokens'
import { trackTitleFilter } from '@/helpers/filter'
import { generateTracksListId } from '@/helpers/miscellaneous'
import usePaganation from '@/helpers/usePaganation'
import { useNavigationSearch } from '@/hooks/useNavigationSearch'
import { useLibraryStore } from '@/store/library'
import { defaultStyles } from '@/styles'
import { useEffect, useMemo } from 'react'
import { View } from 'react-native'

const SongsScreen = () => {
	const search = useNavigationSearch({
		searchBarOptions: {
			placeholder: 'Find in songs',
		},
	})
	const { setTracks, tracks } = useLibraryStore((state) => state)
	const [data, setPage, currentPage] = usePaganation({ data: tracks })

	// const tracks = useTrack()
	// console.log('tracks666', tracks)
	useEffect(() => {
		setTracks()

		return () => {}
	}, [])
	// console.log('tracks', tracks)
	console.log(new Date())

	const filteredTracks = useMemo(() => {
		if (!search) return tracks

		return tracks.filter(trackTitleFilter(search))
	}, [data, search, tracks])
	// console.log('tracks6666', tracks)

	return (
		<View style={defaultStyles.container}>
			{/* <ScrollView
				onScroll={({ nativeEvent }) => {
					if (isCloseToBottom(nativeEvent)) {
						setPage(currentPage + 1)
						console.log('scroll to end')
					}
				}}
				contentInsetAdjustmentBehavior="automatic"
				style={{ paddingHorizontal: screenPadding.horizontal }}
				refreshControl={
					<RefreshControl
						refreshing={false}
						onRefresh={() => {
							// console.log('scroll to end', tracks)
						}}
					/>
				}
			> */}
			<TracksList
				setPage={setPage}
				currentPage={currentPage}
				style={{ paddingHorizontal: screenPadding.horizontal, paddingTop: search ? 20 : 200 }}
				id={generateTracksListId('songs', search)}
				tracks={filteredTracks}
				scrollEnabled={true}
			/>
			{/* </ScrollView> */}
		</View>
	)
}

export default SongsScreen
