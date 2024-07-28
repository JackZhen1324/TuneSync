import { MediaCenter } from '@/components/MediaCenter'
import { getContentAfterFirstDocuments } from '@/components/ResourceManage'
import { useDatasourceConfig } from '@/store/library'
import { defaultStyles } from '@/styles'
import { useRequest } from 'ahooks'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { memo, useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Alert, PermissionsAndroid, Platform, View } from 'react-native'
// const { RNSecurityScopedResource } = NativeModules

import RNFS from 'react-native-fs'

const LocalMedia = memo(() => {
	const { index }: { index: string } = useLocalSearchParams()
	const path = decodeURIComponent(index)
	const [directories, setDirectories] = useState([])
	const { datasourceConfig } = useDatasourceConfig((state) => state)

	const requestPermissions = async () => {
		if (Platform.OS === 'android') {
			try {
				const granted = await PermissionsAndroid.requestMultiple([
					PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
					PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
				])

				return (
					granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] ===
						PermissionsAndroid.RESULTS.GRANTED &&
					granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] ===
						PermissionsAndroid.RESULTS.GRANTED
				)
			} catch (err) {
				console.warn(err)
				return false
			}
		}
		return true
	}

	const readDirectoryFiles = async (directoryUri: string) => {
		const hasPermissions = await requestPermissions()
		if (!hasPermissions) {
			Alert.alert('Permission Denied', 'You need to grant storage permissions to use this feature.')
		}
		try {
			// await startAccessingResource(encodeURIComponent(directoryUri))

			const files = await RNFS.readDir(RNFS.DocumentDirectoryPath + '/' + directoryUri)

			return files.map((file) => {
				return {
					uri: file.path,
					name: file.name,
					isDirectory: file.isDirectory(),
				}
			})
		} catch (error) {
			// stopAccessingResource(encodeURIComponent(directoryUri))
			console.error('Error reading directory2: ', error)
			return []
		}
	}
	const { loading, runAsync } = useRequest(readDirectoryFiles, {
		manual: true,
	})
	const router = useRouter()
	const getDirectoryName = (uri) => {
		// Remove the trailing slash if present
		const trimmedUri = uri.endsWith('/') ? uri.slice(0, -1) : uri
		// Split the URI by slashes
		const parts = trimmedUri.split('/')
		// Get the last part and decode URI components
		return decodeURIComponent(parts[parts.length - 1])
	}
	useEffect(() => {
		if (path === '/') {
			setDirectories(
				datasourceConfig
					.find((el) => el.protocol === 'file')
					.children.map((el) => {
						return {
							type: 'directory',
							basename: getDirectoryName(el),
							filename: el,
							from: 'local',
						}
					}),
			)
		} else {
			readDirectoryFiles(path).then((el: any) => {
				const formatedDirs = el.map((el) => {
					return {
						filename: getContentAfterFirstDocuments(el.uri),
						basename: el.name,
						type: el.isDirectory ? 'directory' : 'file',
						from: 'local',
					}
				})
				setDirectories(formatedDirs)
			})
		}
	}, [datasourceConfig, datasourceConfig.children, path])

	const onDirPress = useCallback((item: { filename: any; type: any }) => {
		const { filename, type } = item

		if (type === 'directory') {
			router.push({
				pathname: `/(tabs)/setting/media/local/${encodeURIComponent(filename)}`,
			})
		}
	}, [])

	return (
		<View key={path} style={defaultStyles.container}>
			{loading ? (
				<View
					style={{
						height: '80%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<ActivityIndicator color={'#fff'} />
				</View>
			) : (
				<MediaCenter key={path} data={directories} onDirPress={onDirPress} />
			)}
		</View>
	)
})

export default LocalMedia
