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
		backgroundColor: 'black',
	},
})

export default Cache
