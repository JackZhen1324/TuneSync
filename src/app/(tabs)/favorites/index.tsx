import { TracksList } from '@/components/TracksList'
import { trackTitleFilter } from '@/helpers/filter'
import { generateTracksListId } from '@/helpers/miscellaneous'
import { useNavigationSearch } from '@/hooks/useNavigationSearch'
import { useFavorateStore } from '@/store/library'
import { defaultStyles } from '@/styles'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
const FavoritesScreen = () => {
	const { t } = useTranslation()
	const search = useNavigationSearch({
		searchBarOptions: {
			placeholder: t('favorites.search'),
		},
	})

	const { favorateTracks, addTracks, setFavorateTracks } = useFavorateStore()

	const filteredFavoritesTracks = useMemo(() => {
		if (!search) return favorateTracks

		return favorateTracks.filter(trackTitleFilter(search))
	}, [search, favorateTracks])

	return (
		<View style={defaultStyles.container}>
			<TracksList
				id={generateTracksListId('favorites', search)}
				scrollEnabled={false}
				tracks={filteredFavoritesTracks}
			/>
		</View>
	)
}

export default FavoritesScreen
