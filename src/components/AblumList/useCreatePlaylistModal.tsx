import { unknownTrackImageUri } from '@/constants/images'
import { colors } from '@/constants/tokens'
import { usePlaylists } from '@/store/library'
import { AntDesign } from '@expo/vector-icons'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Keyboard, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { launchImageLibrary } from 'react-native-image-picker'
export default ({ onClose, setSubmitDisable }) => {
	const { t } = useTranslation()
	const [playlistName, setPlaylistName] = useState('')
	const [iconUri, setIconUri] = useState('')
	const { playlist, setPlaylist } = usePlaylists((state) => state)

	const selectIcon = () => {
		const options = {
			mediaType: 'photo',
			includeBase64: false,
		}
		launchImageLibrary(options, (response) => {
			if (response.didCancel) {
				console.log('User cancelled image picker')
			} else if (response.error) {
				console.log('ImagePicker Error: ', response.error)
			} else if (response.assets && response.assets.length > 0) {
				setIconUri(response.assets[0].uri)
			}
		})
	}
	const handleChange = (el) => {
		setSubmitDisable(!el)
		setPlaylistName(el)
	}
	const handleReset = () => {
		setPlaylistName(''), setIconUri('')
		setSubmitDisable(true)
		Keyboard.dismiss()
	}
	const handleSubmit = () => {
		// Handle form submission logic here

		try {
			const curentItem = {
				type: 'playlist',
				name: playlistName,
				tracks: [],
				artworkPreview: iconUri || unknownTrackImageUri,
			}

			setPlaylist([...playlist, curentItem])
			handleReset()
			onClose()
		} catch (error) {
			console.log(error)
		}
	}
	const render = () => {
		return (
			<View style={styles.modalContent}>
				<TouchableOpacity onPress={selectIcon} style={styles.iconPicker}>
					{iconUri ? (
						<Image source={{ uri: iconUri }} style={styles.iconPreview} />
					) : (
						<View style={styles.iconPlaceholder}>
							<AntDesign name="camera" size={24} color="#fff" />
						</View>
					)}
				</TouchableOpacity>

				<TextInput
					style={styles.input}
					placeholder={t('playlistAdd.title')}
					placeholderTextColor="#888"
					value={playlistName}
					onChangeText={handleChange}
				/>
			</View>
		)
	}

	return [handleSubmit, render]
}

const styles = StyleSheet.create({
	modalContent: {
		// backgroundColor: 'white',
		padding: 20,
		borderRadius: 10,
		alignItems: 'center',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		marginBottom: 20,
	},
	cancelButton: {
		color: '#ff3b30',
		fontSize: 16,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	createButton: {
		color: '#007AFF',
		fontSize: 16,
	},
	iconPicker: {
		marginBottom: 20,
		width: 100,
		height: 100,
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#333',
	},
	iconPlaceholder: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: colors.primary,
		justifyContent: 'center',
		alignItems: 'center',
	},
	iconPreview: {
		width: '100%',
		height: '100%',
		borderRadius: 10,
	},
	input: {
		width: '100%',
		height: 40,
		borderColor: '#333',
		borderRadius: 8,
		paddingHorizontal: 10,
		color: 'white',
		borderBottomWidth: 1,
		// backgroundColor: '#333',
		textAlign: 'center',
	},
})
