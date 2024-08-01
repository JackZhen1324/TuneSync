import BottomUpPanel from '@/components/BottomUpPanel'
import { Setting } from '@/components/Setting'
import { screenPadding } from '@/constants/tokens'
import { useSetting } from '@/store/library'
import { defaultStyles } from '@/styles'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'
import { LanguageCode } from '../../../locales/languageMap'
import LanguageModal from './language'

const SettingScreen = () => {
	const router = useRouter()
	const setting = useSetting()
	const { t, i18n } = useTranslation()
	const [language, setLanguage] = useState<LanguageCode>(i18n.language as LanguageCode)
	const [isPanelVisible, setPanelVisible] = useState(false)
	const handleMenuPress = ({ id }: any) => {
		switch (id) {
			case 'add':
				router.push(`/(tabs)/setting/resource`)
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
			<BottomUpPanel  isVisible={isPanelVisible} onClose={() => setPanelVisible(false)}>
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
