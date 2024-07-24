import { HeaderMemu } from '@/components/headerMenu'
import { StopPropagation } from '@/components/utils/StopPropagation'
import { StackScreenWithSearchBar } from '@/constants/layout'
import { colors } from '@/constants/tokens'
import { indexingDb } from '@/helpers/indexMusic'
import useThemeColor from '@/hooks/useThemeColor'
import { useIndexStore, useLibraryStore, useSpotofyAuthToken } from '@/store/library'
import { storage } from '@/store/mkkv'
import { useQueueStore } from '@/store/queue'
import { defaultStyles } from '@/styles'
import { Entypo } from '@expo/vector-icons'
import { Stack } from 'expo-router'
import { useCallback } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'

const SongsScreenLayout = () => {
	const { loading, percentage, setLoading } = useIndexStore()
	const { token, setToken } = useSpotofyAuthToken()

	const { setTracks } = useLibraryStore((state) => state)
	const theme = useThemeColor()
	const { setActiveQueueId, activeQueueId } = useQueueStore((state) => state)

	const refresh = useCallback(() => {
		setTracks()
		setActiveQueueId(activeQueueId)
	}, [activeQueueId, setActiveQueueId, setTracks])
	const refreshLibrary = useCallback(async () => {
		const el = storage.getString('indexList')
		const config = JSON.parse(el || '[]')
		indexingDb(config, setLoading, refresh, token)
	}, [token])

	return (
		<View style={defaultStyles.container}>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						...StackScreenWithSearchBar,
						headerLargeTitle: true,
						headerTitle: 'Songs',
						headerRight: () => {
							return (
								<StopPropagation>
									{loading ? (
										<View>
											<ActivityIndicator size="small" />
											<Text
												style={{
													color: theme.colors.text,
													fontSize: 12,
												}}
											>
												{percentage.toFixed(1)}%
											</Text>
										</View>
									) : (
										<HeaderMemu refreshLibrary={refreshLibrary}>
											<Entypo name="dots-three-horizontal" size={18} color={colors.icon} />
										</HeaderMemu>
									)}
								</StopPropagation>
							)
						},
					}}
				/>
			</Stack>
		</View>
	)
}

export default SongsScreenLayout
