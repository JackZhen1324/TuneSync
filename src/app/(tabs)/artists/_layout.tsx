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
