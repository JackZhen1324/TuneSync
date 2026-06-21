/*
 * @Author: Zhen Qian zqian15@asu.edu
 * @Date: 2025-02-20 03:24:48
 * @LastEditors: Zhen Qian zqian15@asu.edu
 * @LastEditTime: 2025-02-20 04:17:28
 * @FilePath: /TuneSync/src/app/(tabs)/setting/mediaCenter/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Statistics from '@/components/ Statistics'
import { SafeAreaView, StyleSheet } from 'react-native'

const MediaCenter = () => {
	return (
		<SafeAreaView style={styles.safeArea}>
			<Statistics></Statistics>
		</SafeAreaView>
	)
}
const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#121212',
	},
})

export default MediaCenter
