import { colors } from '@/constants/tokens'
import useThemeColor from '@/hooks/useThemeColor'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet, useColorScheme } from 'react-native'
import {
	Button,
	MD2DarkTheme as PaperDarkTheme,
	Provider as PaperProvider,
	Text,
	TextInput,
	TouchableRipple,
} from 'react-native-paper'
PaperDarkTheme.colors.primary = colors.primary
const ConfigScreen = () => {
	const [configName, setConfigName] = useState('my webdav')
	const [protocol, setProtocol] = useState('webdav')
	const [location, setlocation] = useState('https://')
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [errors, setErrors] = useState({})

	const colorScheme = useColorScheme()
	const isDarkMode = colorScheme === 'dark'

	useEffect(() => {
		loadConfig()
	}, [])

	const loadConfig = async () => {
		try {
			const config = await AsyncStorage.getItem('dataSourceConfig')
			if (config !== null) {
				const parsedConfig = JSON.parse(config)
				setProtocol(parsedConfig.protocol)
				setlocation(parsedConfig.location)
				setUsername(parsedConfig.username)
				setPassword(parsedConfig.password)
			}
		} catch (error) {
			Alert.alert('Error', 'Failed to load config')
		}
	}

	const validate = () => {
		const newErrors = {}
		if (!location) {
			newErrors.location = 'location is required'
		} else if (!/^https?:\/\/.+/.test(location)) {
			newErrors.location = 'Invalid URL format'
		}
		if (!username) {
			newErrors.username = 'Username is required'
		}
		if (!password) {
			newErrors.password = 'Password is required'
		}
		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const saveConfig = async () => {
		if (!validate()) {
			return
		}

		try {
			const config = {
				configName,
				protocol,
				location,
				username,
				password,
			}
			const configData = await AsyncStorage.getItem('dataSourceConfig')

			const newConfig = JSON.parse(configData || '[]')
			const isDuplicate = newConfig.some((el) => {
				console.log('el.location === config.location', el.location, config.location)

				return el.location === config.location
			})
			console.log('isDuplicate', isDuplicate)

			if (!isDuplicate) {
				newConfig.push(config)
				console.log('JSON.stringify(newConfig)', JSON.stringify(newConfig))

				await AsyncStorage.setItem('dataSourceConfig', JSON.stringify(newConfig))
				router.back()
			} else {
				Alert.alert('Error', 'config exist!')
			}

			// Alert.alert('Success', 'Configuration saved successfully')
		} catch (error) {
			Alert.alert('Error', 'Failed to save config')
		}
	}

	const theme = useThemeColor()

	return (
		<PaperProvider theme={theme}>
			<ScrollView
				contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}
			>
				<Text style={[styles.title, { color: theme.colors.text }]}>WebDAV</Text>
				<TextInput
					autoCapitalize="none"
					label="Config Name"
					value={configName}
					onChangeText={setConfigName}
					mode="flat"
					style={styles.input}
					theme={theme}
				/>
				<TextInput
					autoCapitalize="none"
					label="location"
					value={location}
					onChangeText={setlocation}
					mode="flat"
					style={styles.input}
					theme={theme}
					error={!!errors.location}
				/>
				{errors.location ? <Text style={styles.errorText}>{errors.location}</Text> : null}
				<TextInput
					autoCapitalize="none"
					label="Username"
					value={username}
					onChangeText={setUsername}
					mode="flat"
					style={styles.input}
					theme={theme}
					error={!!errors.username}
				/>
				{errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}
				<TextInput
					autoCapitalize="none"
					label="Password"
					value={password}
					onChangeText={setPassword}
					mode="flat"
					style={styles.input}
					secureTextEntry
					theme={theme}
					error={!!errors.password}
				/>
				{errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
				<TouchableRipple centered={true} rippleColor="rgba(0, 0, 0, .32)">
					<Button mode="contained" onPress={saveConfig} style={styles.button}>
						Save Configuration
					</Button>
				</TouchableRipple>
			</ScrollView>
		</PaperProvider>
	)
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	input: {
		marginBottom: 20,
	},
	button: {
		marginTop: 20,
	},
	errorText: {
		color: 'red',
		marginBottom: 20,
	},
})

export default ConfigScreen
