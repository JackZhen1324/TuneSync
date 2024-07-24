import { Setting } from '@/components/Setting'
import { screenPadding } from '@/constants/tokens'
import { useSetting } from '@/store/library'
import { defaultStyles } from '@/styles'
import { useRouter } from 'expo-router'
import { ScrollView, View } from 'react-native'

const SettingScreen = () => {
	const router = useRouter()
	const setting = useSetting()

	const handleMenuPress = ({ title }: any) => {
		switch (title) {
			case 'Add source':
				router.push(`/(tabs)/setting/resource`)
				break
			case 'Folder':
				router.push(`/(tabs)/setting/folder`)
				break
			case 'About':
				router.push(`/(tabs)/setting/about`)
				break
		}
	}

	return (
		<View style={defaultStyles.container}>
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				style={{
					paddingHorizontal: screenPadding.horizontal,
				}}
			>
				<Setting scrollEnabled={false} setting={setting} onMenuPress={handleMenuPress} />
			</ScrollView>
		</View>
	)
}

export default SettingScreen
