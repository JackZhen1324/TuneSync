/*
 * @Author: Zhen Qian zqian15@asu.edu
 * @Date: 2024-11-25 13:33:55
 * @LastEditors: Zhen Qian zqian15@asu.edu
 * @LastEditTime: 2025-02-20 04:20:30
 * @FilePath: /TuneSync/src/app/(tabs)/setting/about/privacy.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import PrivacyPolicy from '@/components/Privacy'
import { colors, screenPadding } from '@/constants/tokens'
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
		backgroundColor: colors.background,
	},
})

export default Privacy
