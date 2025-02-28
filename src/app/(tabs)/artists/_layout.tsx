/*
 * @Author: zhen qian xhdp123@126.com
 * @Date: 2024-11-29 15:48:09
 * @LastEditors: zhen qian xhdp123@126.com
 * @LastEditTime: 2025-02-28 15:34:33
 * @FilePath: /TuneSync/src/app/(tabs)/artists/_layout.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import LibraryDropdownOptions from '@/components/LibraryDropdownOptions'
import { StackScreenWithSearchBar } from '@/constants/layout'
import { colors } from '@/constants/tokens'
import { defaultStyles } from '@/styles'
import { Stack } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

const ArtistsScreenLayout = () => {
	const { t } = useTranslation()
	return (
		<View style={defaultStyles.container}>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						...StackScreenWithSearchBar,
						headerTitle: t('artists.header'),
						headerRight: () => {
							return <LibraryDropdownOptions></LibraryDropdownOptions>
						},
					}}
				/>

				<Stack.Screen
					name="[name]"
					options={{
						headerShadowVisible: false,
						headerTitle: '',
						headerBackVisible: true,
						headerStyle: {
							backgroundColor: colors.background,
						},
						headerTintColor: colors.primary,
					}}
				/>
			</Stack>
		</View>
	)
}

export default ArtistsScreenLayout
