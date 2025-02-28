/*
 * @Author: Zhen Qian zqian15@asu.edu
 * @Date: 2024-12-24 15:15:35
 * @LastEditors: Zhen Qian zqian15@asu.edu
 * @LastEditTime: 2025-02-20 04:21:24
 * @FilePath: /TuneSync/src/app/(tabs)/setting/middleware/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { colors } from '@/constants/tokens'
import { MiddlewareConfigPage } from '@/helpers/middlewares'
import { SafeAreaView, StyleSheet } from 'react-native'

const Cache = () => {
	return (
		<SafeAreaView style={styles.safeArea}>
			<MiddlewareConfigPage></MiddlewareConfigPage>
		</SafeAreaView>
	)
}
const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: colors.background,
	},
})

export default Cache
