import { useLanguageStore } from '@/store/language'
import { Picker } from '@react-native-picker/picker'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

const LanguageModal = () => {
	const { t, i18n } = useTranslation()
	// const [language, setLanguage] = useState(i18n.language)
	const { language, setLanguage } = useLanguageStore((state) => state)

	const changeLanguage = (lang) => {
		i18n.changeLanguage(lang)
		setLanguage(lang)
	}
	return (
		<View style={styles.container}>
			{/* Other settings options */}
			<Picker
				selectedValue={language}
				style={styles.picker}
				onValueChange={(itemValue) => changeLanguage(itemValue)}
			>
				<Picker.Item color="white" style={styles.item} label="English" value="en" />
				<Picker.Item color="white" style={styles.item} label="中文" value="zh" />
				<Picker.Item color="white" style={styles.item} label="한국어" value="ko" />
				<Picker.Item color="white" style={styles.item} label="日本語" value="ja" />
			</Picker>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginHorizontal: 30,
		padding: 20,
		paddingHorizontal: 20,
		paddingTop: 0,
		backgroundColor: '#202020',
	},
	header: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	subHeader: {
		fontSize: 18,
		marginBottom: 10,
		color: 'white',
	},
	picker: {
		height: 50,
		width: '100%',
	},
	item: {
		color: 'white',
	},
})

export default LanguageModal
