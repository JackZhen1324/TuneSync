/*
 * @Author: zhen qian xhdp123@126.com
 * @Date: 2024-11-29 15:48:09
 * @LastEditors: zhen qian xhdp123@126.com
 * @LastEditTime: 2025-03-06 02:35:05
 * @FilePath: /TuneSync/src/app/(tabs)/favorites/_layout.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { StackScreenWithSearchBar } from '@/constants/layout'
import { defaultStyles } from '@/styles'
import { Stack } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
const FavoritesScreenLayout = () => {
	const { t } = useTranslation()
	return (
		<View style={defaultStyles.container}>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						...StackScreenWithSearchBar,
						headerTitle: t('routes.favorites'),
					}}
				/>
			</Stack>
		</View>
	)
}

export default FavoritesScreenLayout
