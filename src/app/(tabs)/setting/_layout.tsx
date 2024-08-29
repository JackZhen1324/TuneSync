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
						headerTitle: t('routes.setting'),
					}}
				/>

				<Stack.Screen
					name="resource"
					options={{
						headerTitle: '',
						headerBackVisible: true,
						headerStyle: {
							backgroundColor: colors.background,
						},
						headerTintColor: colors.primary,
					}}
				/>
				<Stack.Screen
					name="media/webdav/[index]"
					options={{
						headerTitle: '',
						headerBackVisible: true,
						headerStyle: {
							backgroundColor: colors.background,
						},
						headerTintColor: colors.primary,
					}}
				/>
				<Stack.Screen
					name="media/local/[index]"
					options={{
						headerTitle: '',
						headerBackVisible: true,
						headerStyle: {
							backgroundColor: colors.background,
						},
						headerTintColor: colors.primary,
					}}
				/>
				<Stack.Screen
					name="add/webdav"
					options={{
						headerTitle: '',
						headerBackVisible: true,
						headerStyle: {
							backgroundColor: colors.background,
						},
						headerTintColor: colors.primary,
					}}
				/>
				<Stack.Screen
					name="folder/index"
					options={{
						headerTitle: t('setting.folder'),
						headerBackVisible: true,
						headerStyle: {
							backgroundColor: colors.background,
						},
						headerTintColor: colors.primary,
					}}
				/>
				<Stack.Screen
					name="folder/[nest]"
					options={{
						headerTitle: t('setting.folder'),
						headerBackVisible: true,
						headerStyle: {
							backgroundColor: colors.background,
						},
						headerTintColor: colors.primary,
					}}
				/>
				<Stack.Screen
					name="folder/local/[nest]"
					options={{
						headerTitle: t('setting.folder'),
						headerBackVisible: true,
						headerStyle: {
							backgroundColor: colors.background,
						},
						headerTintColor: colors.primary,
					}}
				/>
				<Stack.Screen
					name="folder/webdav/[nest]"
					options={{
						headerTitle: t('setting.folder'),
						headerBackVisible: true,
						headerStyle: {
							backgroundColor: colors.background,
						},
						headerTintColor: colors.primary,
					}}
				/>
				<Stack.Screen
					name="about/index"
					options={{
						headerTitle: '',
						headerBackVisible: true,
						headerStyle: {
							backgroundColor: colors.background,
						},
						headerTintColor: colors.primary,
					}}
				/>
				<Stack.Screen
					name="about/privacy"
					options={{
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

export default PlaylistsScreenLayout
