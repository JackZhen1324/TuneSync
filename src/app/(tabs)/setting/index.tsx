/*
 * @Author: Zhen Qian zqian15@asu.edu
 * @Date: 2024-12-24 15:15:35
 * @LastEditors: Zhen Qian zqian15@asu.edu
 * @LastEditTime: 2025-02-20 03:26:46
 * @FilePath: /TuneSync/src/app/(tabs)/setting/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import BottomUpPanel from '@/components/BottomUpPanel'
import { Setting } from '@/components/Setting'
import { screenPadding } from '@/constants/tokens'
import { useSetting } from '@/store/library'
import { defaultStyles } from '@/styles'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import LanguageModal from './language'

const SettingScreen = () => {
	const router = useRouter()
	const setting = useSetting()
	const [isPanelVisible, setPanelVisible] = useState(false)
	const handleMenuPress = ({ id }: any) => {
		switch (id) {
			case 'add':
				router.push(`/(tabs)/setting/resource`)
				break
			case 'statistics':
				router.push(`/(tabs)/setting/mediaCenter`)
				break
			case 'folder':
				router.push(`/(tabs)/setting/folder`)
				break
			case 'about':
				router.push(`/(tabs)/setting/about`)
				break
			case 'language':
				setPanelVisible(true)
				break
			case 'cache':
				router.push(`/(tabs)/setting/cache`)
				break
			case 'middleware':
				router.push(`/(tabs)/setting/middleware`)
				break
		}
	}

	return (
		<>
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
			<BottomUpPanel isVisible={isPanelVisible} onClose={() => setPanelVisible(false)}>
				<LanguageModal></LanguageModal>
			</BottomUpPanel>
		</>
	)
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#fff',
	},
	header: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	languageOption: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 15,
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
	},
	languageText: {
		fontSize: 18,
	},
	languageValue: {
		fontSize: 18,
		color: '#888',
	},
	modalHeader: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	picker: {
		width: '100%',
	},
})

export default SettingScreen
