import davIcon from '@/assets/icons/dav.png'
import localIcon from '@/assets/icons/local.png'
import useThemeColor from '@/hooks/useThemeColor'
import { useCurrentClientStore, useDatasourceConfig, useIndexStore } from '@/store/library'
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons'
import { useIsFocused } from '@react-navigation/native'
import { router } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native'
import DocumentPicker from 'react-native-document-picker'
import RNFS from 'react-native-fs'
import { List, TouchableRipple } from 'react-native-paper'

export function getContentAfterFirstDocuments(filePath: string) {
	const keyword = 'Documents'
	const keywordIndex = filePath.indexOf(keyword)

	if (keywordIndex === -1) {
		return null
	}

	const startIndex = keywordIndex + keyword.length
	const result = filePath.substring(startIndex)

	// URL decode the result
	const decodedResult = decodeURIComponent(result)

	return decodedResult
}

const ResourceManage = () => {
	const { t } = useTranslation()
	const [added, setAdded] = useState([] as any)
	const { client, setClient } = useCurrentClientStore()
	const isFocused = useIsFocused()
	const { datasourceConfig, setDatasourceConfig } = useDatasourceConfig((state) => state)
	const { setIndexingList, indexingList } = useIndexStore((state) => state)
	const { setNeedUpdate } = useIndexStore()
	const pickDirectory = useCallback(async () => {
		try {
			const result = await DocumentPicker.pickDirectory()
			setIndexingList([])
			if (result) {
				const directoryUri = decodeURIComponent(result.uri)
				const savingPath = 'myDevice' + getContentAfterFirstDocuments(directoryUri)
				const configs = datasourceConfig || ([] as any)
				const currentLocal = configs?.find((el: { protocol: string }) => el.protocol === 'file')
				let newChildren = [] as any
				if (currentLocal) {
					if (!currentLocal.children.includes(savingPath)) {
						newChildren = [...currentLocal.children, savingPath]
						const localConfig = {
							configName: 'my device',
							protocol: 'file',
							location: 'file',
							children: newChildren,
						}

						await readDirectoryFiles(directoryUri)
						const newConfig = configs.map((el: { protocol: string }) => {
							if (el.protocol === 'file') {
								return localConfig
							}
							return el
						})
						setDatasourceConfig(newConfig)
					}
				} else {
					newChildren = [savingPath]
					const localConfig = {
						from: 'local',
						configName: 'my device',
						protocol: 'file',
						children: newChildren,
					}

					const newConfig = [...configs, localConfig] as any

					await readDirectoryFiles(directoryUri)
					setDatasourceConfig(newConfig)
				}
				const finalIndxingList = newChildren.map((el: string) => {
					return {
						basename: el.split('/').slice(0, -1).pop(),
						filename: el,
						dir: el,
						type: 'directory',
						from: 'local',
						title: el.split('/').slice(0, -1).pop(),
					}
				})

				setIndexingList([...finalIndxingList, ...indexingList])
				setNeedUpdate(true)
			}
		} catch (err) {
			setNeedUpdate(false)
			if (DocumentPicker.isCancel(err)) {
				console.log('User cancelled the picker')
			} else {
				console.log('Unknown error: ', err)
			}
		}
	}, [datasourceConfig, indexingList, setDatasourceConfig, setIndexingList, setNeedUpdate])

	const readDirectoryFiles = async (directoryUri: string) => {
		try {
			const files = await RNFS.readDir(directoryUri)

			for (const file of files) {
				const pickedFilePath = file.path

				try {
					const folderName = directoryUri.split('/').slice(0, -1).pop()

					const destinationPath = `${RNFS.DocumentDirectoryPath}/myDevice/${folderName}/${file.name}`
					const exists = await RNFS.exists(`${RNFS.DocumentDirectoryPath}/myDevice/${folderName}/`)

					if (!exists) {
						await RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/myDevice/${folderName}/`)
						await RNFS.copyFile(pickedFilePath, destinationPath)
					} else {
						await RNFS.copyFile(pickedFilePath, destinationPath)
					}
				} catch (error) {
					console.error('Error ensuring directory exists:', error)
				}
			}
		} catch (error) {
			console.error('Error reading directory files:', error)
		}
	}

	const onPressOut = useCallback(
		(item: string, mode: string, selected?: string) => {
			switch (item) {
				case 'webdav':
					mode === 'create'
						? router.push('/setting/add/webdav')
						: router.push({
								pathname: '/setting/add/webdav',
								params: {
									selected: selected || '',
								},
							})
					break
				case 'local':
					if (mode === 'create') {
						pickDirectory()
					} else {
						const currentLocal = datasourceConfig?.find(
							(el: { protocol: string }) => el.protocol === 'file',
						)

						for (const child of currentLocal.children) {
							const pendingRemove = RNFS.DocumentDirectoryPath + '/' + child

							setIndexingList(
								indexingList.filter((indexItem) => {
									console.log(indexItem, child, 'delete local')

									return indexItem.dir !== child
								}),
							)
							setNeedUpdate(true)
							RNFS.unlink(pendingRemove)
						}
						setDatasourceConfig(
							datasourceConfig.filter((el: { protocol: string }) => el.protocol !== 'file'),
						)
					}
			}
		},
		[
			datasourceConfig,
			indexingList,
			pickDirectory,
			setDatasourceConfig,
			setIndexingList,
			setNeedUpdate,
		],
	)

	useEffect(() => {
		if (isFocused) {
			const config = datasourceConfig
			setAdded(config || [])
		}
	}, [datasourceConfig, isFocused])

	const theme = useThemeColor()
	const renderAddedResource = () => {
		return datasourceConfig?.map((el: any) => {
			return (
				<TouchableRipple
					key={el.location}
					style={{ borderRadius: 4 }}
					borderless
					onPress={() => {
						if (el.protocol === 'webdav') {
							setClient(el)
							router.push({
								pathname: `/(tabs)/setting/media/webdav/${encodeURIComponent('/')}`,
							})
						} else if (el.protocol === 'file') {
							router.push({
								pathname: `/(tabs)/setting/media/local/${encodeURIComponent('/')}`,
							})
						}
					}}
					rippleColor="rgba(0, 0, 0, .32)"
				>
					<List.Item
						style={styles.itemSolo}
						theme={theme}
						title={el.configName}
						right={() => {
							if (el.protocol === 'file') {
								return (
									<TouchableRipple
										key={el.location}
										style={{ borderRadius: 4 }}
										borderless
										onPress={(e) => {
											e.stopPropagation()
											onPressOut('local', 'remove', el.location)
										}}
										rippleColor="rgba(0, 0, 0, .32)"
									>
										<MaterialIcons
											style={{ paddingTop: 6 }}
											name="delete-outline"
											size={20}
											color={theme.colors.primary}
										/>
									</TouchableRipple>
								)
							}
							return (
								<TouchableRipple
									key={el.location}
									style={{ borderRadius: 4 }}
									borderless
									onPress={(e) => {
										e.stopPropagation()
										onPressOut('webdav', 'edit', el.location)
									}}
									rippleColor="rgba(0, 0, 0, .32)"
								>
									<FontAwesome6
										style={{ paddingTop: 6 }}
										color={theme.colors.primary}
										name="edit"
										size={16}
									/>
								</TouchableRipple>
							)
						}}
						left={() => {
							if (el.protocol === 'file') {
								return <List.Icon icon={localIcon} />
							} else {
								return <List.Icon icon={davIcon} />
							}
						}}
					/>
				</TouchableRipple>
			)
		})
	}

	return (
		<SafeAreaView style={styles.container}>
			<List.Section theme={theme}>
				<List.Subheader theme={theme}>
					{t('setting.localResource') || 'Local resource'}
				</List.Subheader>
				<TouchableRipple borderless style={{ borderRadius: 4 }} rippleColor="rgba(0, 0, 0, .32)">
					<List.Item
						onPressOut={() => {
							onPressOut('local', 'create')
						}}
						style={styles.itemSolo}
						theme={theme}
						title="Local"
						left={() => <List.Icon color={theme.colors.primary} icon="plus" />}
					/>
				</TouchableRipple>
				<List.Subheader theme={theme}>
					{t('setting.remoteResource') || 'Remote resource'}
				</List.Subheader>
				<TouchableRipple style={{ borderRadius: 4 }} borderless rippleColor="rgba(0, 0, 0, .32)">
					<List.Item
						onPressOut={() => {
							onPressOut('webdav', 'create')
						}}
						style={styles.itemSolo}
						theme={theme}
						title={t('setting.webdavResource') || 'Webdav resource'}
						left={() => <List.Icon color={theme.colors.primary} icon="plus" />}
					/>
				</TouchableRipple>
				{added?.length > 0 && (
					<List.Subheader theme={theme}>{t('setting.addedResource')}</List.Subheader>
				)}
				{renderAddedResource()}
			</List.Section>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: StatusBar.currentHeight,
		marginHorizontal: 8,
	},
	itemSolo: {
		padding: 16,
		paddingHorizontal: 26,
		borderRadius: 6,
		marginBottom: 4,
		backgroundColor: 'rgba(28,28,30,1)',
	},
})

export default ResourceManage
