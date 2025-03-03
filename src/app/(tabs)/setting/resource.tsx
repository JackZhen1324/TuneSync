import ResourceManage from '@/components/ResourceManage'
import { useRefreshLibrary } from '@/hooks/useRefreshLibrary'
import { defaultStyles } from '@/styles'
import { useFocusEffect } from 'expo-router'
import { useCallback } from 'react'
import { View } from 'react-native'

const Resouce = () => {
	const { refreshLibraryWithCache } = useRefreshLibrary()
	useFocusEffect(
		useCallback(() => {
			return () => {
				refreshLibraryWithCache()
			}
		}, []),
	)
	return (
		<View style={defaultStyles.container}>
			<ResourceManage />
		</View>
	)
}

export default Resouce
