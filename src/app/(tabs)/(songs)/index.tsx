/*
 * @Author: zhen qian xhdp123@126.com
 * @Date: 2025-02-13 18:25:50
 * @LastEditors: zhen qian xhdp123@126.com
 * @LastEditTime: 2025-02-28 15:37:13
 * @FilePath: /TuneSync/src/app/(tabs)/(songs)/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { TracksList } from '@/components/TracksList'
import { trackTitleFilter } from '@/helpers/filter'
import { useNavigationSearch } from '@/hooks/useNavigationSearch'
import { useLibraryStore } from '@/store/library'
import { defaultStyles } from '@/styles'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

const SongsScreen = () => {
	const { t } = useTranslation()
	const search = useNavigationSearch({
		searchBarOptions: {
			placeholder: t('songs.search'),
		},
	})

	const { tracks } = useLibraryStore((state) => state)

	const filteredTracks = useMemo(() => {
		if (!search) return tracks

		return tracks.filter(trackTitleFilter(search))
	}, [search, tracks])

	return (
		<View style={defaultStyles.container}>
			<TracksList tracks={filteredTracks} scrollEnabled={true} search={search} />
		</View>
	)
}

export default SongsScreen
