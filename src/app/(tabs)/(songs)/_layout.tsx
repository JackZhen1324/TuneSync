/*
 * @Author: Zhen Qian zqian15@asu.edu
 * @Date: 2024-12-24 15:57:30
 * @LastEditors: zhen qian xhdp123@126.com
 * @LastEditTime: 2025-02-28 14:03:37
 * @FilePath: /TuneSync/src/app/(tabs)/(songs)/_layout.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import LibraryDropdownOptions from '@/components/LibraryDropdownOptions'
import { StackScreenWithSearchBar } from '@/constants/layout'
import { defaultStyles } from '@/styles'
import { Stack } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'

const updates: Array<{ title: string; url: string; pendingMeta?: boolean }> = []

const SongsScreenLayout = () => {
	const { t } = useTranslation()

	return (
		<SafeAreaView style={defaultStyles.container}>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						...StackScreenWithSearchBar,
						headerLargeTitle: true,
						headerTitle: t('songs.header'),
						headerRight: () => {
							return <LibraryDropdownOptions></LibraryDropdownOptions>
						},
					}}
				/>
			</Stack>
		</SafeAreaView>
	)
}

export default SongsScreenLayout
