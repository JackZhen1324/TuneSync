import { colors } from '@/constants/tokens'
import StorageUtil from '@/helpers/storage'
import useThemeColor from '@/hooks/useThemeColor'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet } from 'react-native'
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
	const [modalVisible, setModalVisible] = useState(false)
	const [password, setPassword] = useState('')
	const [errors, setErrors] = useState({})
	const { selected } = useLocalSearchParams()
	const [hidePassword, setHidePassword] = React.useState(true)

	const loadConfig = useCallback(async () => {
		try {
			const config = await AsyncStorage.getItem('dataSourceConfig')
			if (config !== null) {
				const parsedConfig = JSON.parse(config)
				const getMatchedConfig = parsedConfig.find(
					(el: { location: string | string[] }) => el.location === selected,
				)
				setProtocol(getMatchedConfig.protocol)
				setlocation(getMatchedConfig.location)
				setUsername(getMatchedConfig.username)
				setPassword(getMatchedConfig.password)
				setConfigName(getMatchedConfig.configName)
			}
		} catch (error) {
			Alert.alert('Error', 'Failed to load config')
		}
	}, [selected])
	useEffect(() => {
		if (selected) {
			loadConfig()
		}
	}, [loadConfig, selected])
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
	const deleteConfig = useCallback(async () => {
		const config = await StorageUtil.get('dataSourceConfig')
		await StorageUtil.save(
			'dataSourceConfig',
			(config || [])?.filter((el: { location: string | string[] }) => el.location !== selected),
		)
		router.back()
	}, [selected])
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
			let newConfig = JSON.parse(configData || '[]')
			const isDuplicate = newConfig.some((el: { location: string }) => {
				return el.location === config.location
			})

			if (!isDuplicate || selected) {
				if (selected) {
					newConfig = newConfig.map((el: { location: string | string[] }) => {
						if (el.location === selected) {
							return config
						}
						return el
					})
				} else {
					newConfig.push(config)
				}

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
					secureTextEntry={hidePassword}
					theme={theme}
					error={!!errors.password}
					right={
						<TextInput.Icon
							onPress={() => setHidePassword(!hidePassword)}
							icon={hidePassword ? 'eye' : 'eye-off'}
						/>
					}
				/>

				{errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
				<TouchableRipple centered={true} rippleColor="rgba(0, 0, 0, .32)">
					<Button mode="contained" onPress={saveConfig} style={styles.button}>
						<Text style={{ color: theme.colors.text }}>Save Configuration</Text>
					</Button>
				</TouchableRipple>
				{selected && (
					<TouchableRipple centered={true} rippleColor="rgba(0	, 0, 0, .32)">
						<Button mode="contained" onPress={deleteConfig} style={styles.delButton}>
							<Text style={{ color: colors.errorColor }}>Delete Configuration</Text>
						</Button>
					</TouchableRipple>
				)}
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
	delButton: {
		backgroundColor: 'white',
		marginTop: 20,
	},
})

export default ConfigScreen
