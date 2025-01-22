import { FloatingPlayer } from '@/components/FloatingPlayer'
import ReanimatedCarousel from '@/components/TracksList/CardView'
import { colors, fontSize } from '@/constants/tokens'
import { useIsLandscape } from '@/hooks/useIsLandcape'
import { AntDesign, FontAwesome, FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { Tabs } from 'expo-router'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, StyleSheet } from 'react-native'
const TabsNavigation = () => {
	const { t } = useTranslation()
	const animatedValue = useRef(new Animated.Value(0)).current

	const isLandscape = useIsLandscape()
	useEffect(() => {
		Animated.timing(animatedValue, {
			toValue: 1,
			duration: 300,
			useNativeDriver: true,
		}).start()
	}, [isLandscape])
	return (
		<Animated.View style={{ ...styles.container, opacity: animatedValue }}>
			{isLandscape ? (
				<ReanimatedCarousel />
			) : (
				<>
					<Tabs
						screenOptions={{
							tabBarActiveTintColor: colors.primary,
							tabBarLabelStyle: {
								fontSize: fontSize.xs,
								fontWeight: '500',
							},

							headerShown: false,
							tabBarStyle: {
								position: 'absolute',
								borderTopLeftRadius: 20,
								borderTopRightRadius: 20,
								borderTopWidth: 0,
								paddingTop: 8,
							},
							tabBarBackground: () => (
								<BlurView
									intensity={95}
									style={{
										...StyleSheet.absoluteFillObject,
										overflow: 'hidden',
										borderTopLeftRadius: 20,
										borderTopRightRadius: 20,
									}}
								/>
							),
						}}
					>
						<Tabs.Screen
							name="favorites"
							options={{
								title: t('routes.favorites'),
								tabBarIcon: ({ color }) => <FontAwesome name="heart" size={20} color={color} />,
							}}
						/>
						<Tabs.Screen
							name="collections"
							options={{
								title: t('routes.collections'),
								tabBarIcon: ({ color }) => (
									<MaterialIcons name="library-music" size={24} color={color} />
								),
							}}
						/>
						<Tabs.Screen
							name="(songs)"
							options={{
								title: t('routes.songs'),
								tabBarIcon: ({ color }) => (
									<Ionicons name="musical-notes-sharp" size={24} color={color} />
								),
							}}
						/>
						<Tabs.Screen
							name="artists"
							options={{
								title: t('routes.artists'),
								tabBarIcon: ({ color }) => (
									<FontAwesome6 name="users-line" size={20} color={color} />
								),
							}}
						/>
						<Tabs.Screen
							name="setting"
							options={{
								title: t('routes.setting'),
								tabBarIcon: ({ color }) => <AntDesign name="setting" size={23} color={color} />,
							}}
						/>
					</Tabs>

					<FloatingPlayer
						style={{
							position: 'absolute',
							left: 8,
							right: 8,
							bottom: 78,
						}}
					/>
				</>
			)}
		</Animated.View>
	)
}
const styles = StyleSheet.create({
	container: {
		// width: '100%',
		display: 'flex',
		flex: 1,
		// justifyContent: 'center',
		// alignItems: 'center',
	},
})

export default TabsNavigation
