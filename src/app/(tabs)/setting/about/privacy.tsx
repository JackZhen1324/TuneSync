import PrivacyPolicy from '@/components/Privacy'
import { screenPadding } from '@/constants/tokens'
import { useSetting } from '@/store/library'
import { defaultStyles } from '@/styles'
import { useRouter } from 'expo-router'
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'

const Privacy = () => {
	const router = useRouter()
	const setting = useSetting()

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={defaultStyles.container}>
				<ScrollView
					contentInsetAdjustmentBehavior="automatic"
					style={{
						paddingHorizontal: screenPadding.horizontal,
					}}
				>
					<PrivacyPolicy></PrivacyPolicy>
				</ScrollView>
			</View>
		</SafeAreaView>
	)
}
const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: 'black',
	},
})

export default Privacy
