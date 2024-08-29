import { StackScreenWithSearchBar } from '@/constants/layout'
import { colors } from '@/constants/tokens'
import { Stack } from 'expo-router'
import { useTranslation } from 'react-i18next'
const PlaylistsScreenLayout = () => {
	const { t } = useTranslation()
	return (
		
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						...StackScreenWithSearchBar,
						headerTitle: t('collections.header'),
					}}
				/>

				<Stack.Screen
					name="[name]"
					options={{
						headerTitle: '',
						headerShadowVisible: false,
						headerBackVisible: true,
						headerStyle: {
							backgroundColor: colors.background,
						},
						headerTintColor: colors.primary,
					}}
				/>
			</Stack>
	
	)
}

export default PlaylistsScreenLayout
