import { StackScreenWithSearchBar } from '@/constants/layout'
import { Stack } from 'expo-router'
import { useTranslation } from 'react-i18next'
const FavoritesScreenLayout = () => {
	const { t } = useTranslation()
	return (
	
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						...StackScreenWithSearchBar,
						headerTitle: t('routes.favorites'),
					}}
				/>
			</Stack>
	
	)
}

export default FavoritesScreenLayout
