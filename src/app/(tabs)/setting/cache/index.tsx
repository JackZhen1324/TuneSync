import CacheManagement from '@/components/CacheManagement'
import { screenPadding } from '@/constants/tokens'
import { defaultStyles } from '@/styles'
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'

const Cache = () => {
	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={defaultStyles.container}>
				<ScrollView
					contentInsetAdjustmentBehavior="automatic"
					style={{
						paddingHorizontal: screenPadding.horizontal,
					}}
				>
					<CacheManagement></CacheManagement>
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

export default Cache
