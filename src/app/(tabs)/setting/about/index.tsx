import logo from '@/assets/icon.png'
import { router } from 'expo-router'
import React from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const AboutPage = () => {
	const handlePress = (menu) => {
		switch (menu) {
			case 'privacy':
				router.push('/setting/about/privacy')
		}
	}
	return (
		<ScrollView contentContainerStyle={styles.container}>
			<View style={styles.content}>
				<Image
					source={logo} // Replace with your logo URL
					style={styles.logo}
				/>
				<Text style={styles.appName}>TuneSync</Text>
				<Text style={styles.subtitle}>Sync everything</Text>

				<View style={styles.option}>
					<Text style={styles.optionText}>当前版本</Text>
					<Text style={styles.optionValue}>0.1.0</Text>
				</View>
				<TouchableOpacity style={styles.option}>
					<Text style={styles.optionText}>检查更新</Text>
					<Text style={styles.optionValue}>已是最新版本 </Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.option}>
					<Text style={styles.optionText}>反馈与建议</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.option}>
					<Text style={styles.optionText}>官网</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => handlePress('privacy')} style={styles.option}>
					<Text style={styles.optionText}>隐私声明</Text>
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
