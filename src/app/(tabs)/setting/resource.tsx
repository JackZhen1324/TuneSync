import ResourceManage from '@/components/ResourceManage'
import { defaultStyles } from '@/styles'
import { useLocalSearchParams } from 'expo-router'
import { View } from 'react-native'

const Resouce = () => {
	const { name: playlistName } = useLocalSearchParams<{ name: string }>()

	return (
		<View style={defaultStyles.container}>
			<ResourceManage />
		</View>
	)
}

export default Resouce
