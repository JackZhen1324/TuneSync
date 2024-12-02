import logo from '@/assets/icon.png'
import { useRouter } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const AboutPage = () => {
	const { t } = useTranslation()
	const router = useRouter()
	// 处理菜单点击事件
	const handlePress = (menu) => {
		switch (menu) {
			case 'report':
				Linking.openURL('https://github.com/JackZhen1324/TuneSync/issues').catch((err) =>
					console.error("Couldn't load page", err),
				)
				break
			case 'website':
				Linking.openURL('https://github.com/JackZhen1324/TuneSync').catch((err) =>
					console.error("Couldn't load page", err),
				)
				break
			case 'privacy':
				router.push('/setting/about/privacy')
				break
			default:
				break
		}
	}

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<View style={styles.content}>
				<Image
					source={logo} // 替换为你的 logo 路径
					style={styles.logo}
				/>
				<Text style={styles.appName}>TuneSync</Text>
				<Text style={styles.subtitle}>Sync everything</Text>

				<View style={styles.option}>
					<Text style={styles.optionText}>{t('about.version')}</Text>
					<Text style={styles.optionValue}>0.1.0</Text>
				</View>

				{/* 跳转到 GitHub Issues */}
				<TouchableOpacity onPress={() => handlePress('report')} style={styles.option}>
					<Text style={styles.optionText}>{t('about.report')}</Text>
				</TouchableOpacity>

				{/* 跳转到 GitHub 页面 */}
				<TouchableOpacity onPress={() => handlePress('website')} style={styles.option}>
					<Text style={styles.optionText}>{t('about.website')}</Text>
				</TouchableOpacity>

				{/* 跳转到隐私政策 */}
				<TouchableOpacity onPress={() => handlePress('privacy')} style={styles.option}>
					<Text style={styles.optionText}>{t('about.privacy')}</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		backgroundColor: 'black',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		backgroundColor: '#003366',
	},
	backButton: {
		marginRight: 16,
	},
	backButtonText: {
		color: '#FFFFFF',
		fontSize: 18,
	},
	headerTitle: {
		color: '#FFFFFF',
		fontSize: 18,
		fontWeight: 'bold',
	},
	content: {
		alignItems: 'center',
		padding: 20,
	},
	logo: {
		width: 80,
		height: 80,
		marginBottom: 10,
		borderRadius: 20,
	},
	appName: {
		fontSize: 24,
		color: '#FFFFFF',
		marginBottom: 5,
	},
	subtitle: {
		fontSize: 16,
		color: '#AAAAAA',
		marginBottom: 30,
	},
	option: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: '#555555',
	},
	optionText: {
		color: '#FFFFFF',
		fontSize: 16,
	},
	optionValue: {
		color: '#AAAAAA',
		fontSize: 16,
	},
	bottomPlayer: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		backgroundColor: '#444444',
		position: 'absolute',
		bottom: 0,
		width: '100%',
	},
	albumArt: {
		width: 50,
		height: 50,
		marginRight: 10,
	},
	trackInfo: {
		flex: 1,
	},
	trackTitle: {
		color: '#FFFFFF',
		fontSize: 14,
	},
	trackArtist: {
		color: '#AAAAAA',
		fontSize: 12,
	},
	playlistButton: {
		marginLeft: 10,
	},
	playlistButtonText: {
		color: '#FFFFFF',
		fontSize: 20,
	},
})

export default AboutPage