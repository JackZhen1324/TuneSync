/*
 * @Author: Zhen Qian zqian15@asu.edu
 * @Date: 2025-02-20 17:09:06
 * @LastEditors: zhen qian xhdp123@126.com
 * @LastEditTime: 2025-03-01 18:54:56
 * @FilePath: /TuneSync/src/hooks/useLibraryRefresh.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { HeaderMemu } from '@/components/headerMenu'
import { StopPropagation } from '@/components/utils/StopPropagation'
import { colors } from '@/constants/tokens'
import { useIndexStore } from '@/store/library'
import { Entypo } from '@expo/vector-icons'
import { ActivityIndicator, Text, View } from 'react-native'
import { useResumeMetadataExtraction } from '../../hooks/useMetadataExtration'
import { useRefreshLibrary } from '../../hooks/useRefreshLibrary'
import useThemeColor from '../../hooks/useThemeColor'
export default () => {
	const { refreshLibrary, refreshLibraryWithCacheWithoutDebounce } = useRefreshLibrary()
	const { refreshMetadata } = useResumeMetadataExtraction()
	const theme = useThemeColor()
	const { loading, current } = useIndexStore()
	const data = [
		{
			id: 'refresh-metadata',
			title: 'Refresh metadata',
			image: 'load',
			action: refreshMetadata,
		},
		{
			id: 'refresh-library-partial',
			title: 'Refresh library',
			image: 'reload',
			action: refreshLibraryWithCacheWithoutDebounce,
		},
		{
			id: 'refresh-library',
			title: 'Refresh All Data',
			image: 'reload',
			action: refreshLibrary,
		},
	]

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
				<HeaderMemu data={data}>
					<Entypo name="dots-three-horizontal" size={18} color={colors.icon} />
				</HeaderMemu>
			)}
		</StopPropagation>
	)
}
