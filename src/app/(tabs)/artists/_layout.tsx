import { StackScreenWithSearchBar } from '@/constants/layout'
import { colors } from '@/constants/tokens'
import { Stack } from 'expo-router'
import { useTranslation } from 'react-i18next'

const ArtistsScreenLayout = () => {
	const { t } = useTranslation()
	return (

			<Stack>
				<Stack.Screen
					name="index"
					options={{
						...StackScreenWithSearchBar,
						headerTitle: t('artists.header'),
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
		
	)
}

export default ArtistsScreenLayout
