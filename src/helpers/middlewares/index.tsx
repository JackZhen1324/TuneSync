import { colors } from '@/constants/tokens'
import { useMiddleware } from '@/store/middleware'
import { router } from 'expo-router'
import React, { useCallback, useState } from 'react'
import {
	Linking,
	Pressable,
	StyleSheet,
	Switch,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist'
import { Checkbox } from 'react-native-paper'
import { MiddlewareEntry, Target, Task } from './const'

interface Props {
	onSave?: (updatedList: MiddlewareEntry[]) => void
}

export const MiddlewareConfigPage: React.FC<Props> = () => {
	const { middlewareConfigs, setConfig: save } = useMiddleware()
	const [middlewareList, setMiddlewareList] = useState<MiddlewareEntry[]>([...middlewareConfigs])

	// 控制API Key的可见性
	const [apiKeyVisibleMap, setApiKeyVisibleMap] = useState<Record<string, boolean>>({})

	const onDragEnd = useCallback(({ data }: any) => {
		const updated = data.map(
			(item: MiddlewareEntry, index: number) => ({ ...item, order: index }) as MiddlewareEntry,
		) // Ensure type conformity
		setMiddlewareList(updated)
	}, [])

	const toggleEnabled = (id: string) => {
		const newList = middlewareList.map((item) => {
			if (item.id === id) {
				return { ...item, enabled: !item.enabled } as MiddlewareEntry // Ensure type conformity
			}
			return item as MiddlewareEntry // Ensure type conformity
		})
		setMiddlewareList(newList)
	}

	const setConfig = (id: string, key: string, value: any) => {
		const newList = middlewareList.map((item) => {
			if (item.id === id) {
				return { ...item, config: { ...item.config, [key]: value } } as MiddlewareEntry
			}
			return item
		})

		setMiddlewareList(newList)
	}

	// 检测修改
	const [modified] = useState(true)

	const handleSave = () => {
		save?.(middlewareList)
		router.back()
		// 保存后更新initialList
		// 这里要更新initialList比较复杂，因为initialList是state，若想更新需使用useRef或其他方式
		// 简单处理：保存后不改initialList，使按钮再次变为hidden需要用户再次改变
		// 或调用onSave时也意味着用户确认了修改，可以刷新页面或者关闭页面。
	}

	const toggleApiKeyVisibility = (id: string) => {
		setApiKeyVisibleMap((prev) => ({ ...prev, [id]: !prev[id] }))
	}

	const renderFallbackConfig = (item: MiddlewareEntry) => {
		const apiKeyVisible = !!apiKeyVisibleMap[item.id]
		return (
			<>
				<View style={styles.configRow}>
					<Text style={styles.configLabel}>API Source:</Text>
					<TouchableOpacity
						style={styles.apiSourceButton}
						onPress={() =>
							Linking.openURL('https://www.last.fm/api').catch((err) =>
								console.error("Couldn't load page", err),
							)
						}
					>
						<Text style={styles.apiSourceButtonText}>Last.fm</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.configRow}>
					<Text style={styles.configLabel}>API Key:</Text>
					<View style={styles.apiKeyContainer}>
						<TextInput
							style={styles.apiKeyInput}
							placeholder="Enter API Key"
							placeholderTextColor="#555"
							value={item.config?.apiKey}
							onChangeText={(val) => setConfig(item.id, 'apiKey', val)}
							secureTextEntry={!apiKeyVisible}
						/>
						<TouchableOpacity
							onPress={() => toggleApiKeyVisibility(item.id)}
							style={styles.eyeButton}
						>
							<Text style={{ color: '#fff', fontSize: 14 }}>{apiKeyVisible ? '👁' : '👁‍🗨'}</Text>
						</TouchableOpacity>
					</View>
				</View>
			</>
		)
	}

	const renderItem = ({ item, drag, isActive }: RenderItemParams<MiddlewareEntry>) => {
		let targets = {} as Target
		let tasks = {} as Task
		if (item?.config?.targets) {
			targets = item?.config?.targets
		} else if (item.id === 'base') {
			targets = { mp3: true, flac: false, others: true }
		} else {
			targets = { mp3: false, flac: true, others: false }
		}
		if (item?.config?.tasks) {
			tasks = item?.config?.tasks
		} else {
			tasks = {
				title: true,
				description: false,
				artwork: true,
				album: true,
				artist: true,
				releaseDate: true,
			}
		}
		return (
			<View style={[styles.itemContainer, isActive && { backgroundColor: '#333' }]}>
				{/* 拖拽手柄区域 */}
				<Pressable onPressIn={drag} style={styles.dragHandle}>
					<Text style={styles.dragHandleText}>≡</Text>
				</Pressable>

				<View style={styles.infoContainer}>
					<Text style={styles.itemTitle}>{item.name}</Text>
					<Text style={styles.itemDesc}>{item.description}</Text>
					<View style={styles.configContainer}>
						<View style={styles.configRow}>
							<Text style={styles.configLabel}>Targets:</Text>
							<View style={styles.checkboxContainer}>
								{Object.keys(targets).map((el) => {
									return (
										<View key={el} style={styles.checkboxContent}>
											<Text style={styles.checkboxLabel}>{el}</Text>
											<Checkbox
												theme={{
													dark: true,
													version: 3,
													mode: 'exact',
													colors: { primary: colors.primary },
												}}
												status={targets[el as keyof Target] ? 'checked' : 'unchecked'}
												onPress={() => {
													setConfig(item.id, 'targets', {
														...targets,
														[el as keyof Target]: !targets[el as keyof Target],
													})
												}}
											/>
										</View>
									)
								})}
							</View>
						</View>
						<View style={styles.configRow}>
							<Text style={styles.configLabel}>Tasks:</Text>
							<View style={styles.checkboxContainer}>
								{Object.keys(tasks).map((el) => {
									return (
										<View key={el} style={styles.checkboxContent}>
											<Text style={styles.checkboxLabel}>{el}</Text>
											<Checkbox
												theme={{
													dark: true,
													version: 3,
													mode: 'exact',
													colors: { primary: colors.primary },
												}}
												status={tasks[el as keyof Task] ? 'checked' : 'unchecked'}
												onPress={() => {
													setConfig(item.id, 'tasks', {
														...tasks,
														[el]: !tasks[el as keyof Task],
													})
												}}
											/>
										</View>
									)
								})}
							</View>
						</View>
						{item.id === 'fallback' && renderFallbackConfig(item)}
					</View>
				</View>
				<View style={styles.controls}>
					<Switch
						value={item.enabled}
						onValueChange={() => toggleEnabled(item.id)}
						thumbColor={item.enabled ? colors.primary : '#555'}
						trackColor={{ true: '#444', false: '#222' }}
					/>
				</View>
			</View>
		)
	}

	return (
		<View style={styles.container}>
			<View style={{ flex: 1, marginBottom: 20 }}>
				<DraggableFlatList
					data={middlewareList.sort((a, b) => a.order - b.order)}
					keyExtractor={(item) => item.id}
					renderItem={renderItem}
					onDragEnd={onDragEnd}
					ListFooterComponent={() => {
						return (
							modified && (
								<TouchableOpacity onPress={handleSave} style={styles.saveButton}>
									<Text style={styles.saveButtonText}>Save</Text>
								</TouchableOpacity>
							)
						)
					}}
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	checkboxContainer: {
		flex: 1,
		display: 'flex',
		flexWrap: 'wrap',
		flexDirection: 'row',
	},
	checkboxContent: {
		width: 80,
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	checkboxLabel: { color: '#ccc' },
	checkbox: {
		alignSelf: 'center',
	},
	container: { flex: 1, backgroundColor: colors.background, padding: 8, paddingBottom: 80 },
	scrollContent: {
		padding: 16,
	},
	apiSourceButton: {
		backgroundColor: '#222',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 4,
	},
	apiSourceButtonText: { color: '#fff' },
	title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#fff' },
	itemContainer: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#333',
		padding: 8,
		alignItems: 'center',
		borderRadius: 4,
	},
	dragHandle: {
		width: 20,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 8,
	},
	dragHandleText: {
		color: '#fff',
		fontSize: 24,
	},
	infoContainer: { flex: 1 },
	itemTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },
	itemDesc: { fontSize: 12, color: '#aaa', marginBottom: 5 },
	controls: { marginLeft: 10 },
	configContainer: {
		marginTop: 8,
		padding: 8,
		borderRadius: 4,
	},
	configRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 20,
	},
	configLabel: {
		color: '#ccc',
		marginRight: 8,
		width: 80,
	},
	pickerWrapper: {
		flex: 1,
		borderWidth: 1,
		borderColor: '#444',
		borderRadius: 4,
		overflow: 'hidden',
	},
	picker: {
		color: '#fff',
		backgroundColor: '#222',
	},
	apiKeyContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	apiKeyInput: {
		flex: 1,
		backgroundColor: '#222',
		color: '#fff',
		paddingHorizontal: 8,
		paddingVertical: 6,
		borderRadius: 4,
		marginRight: 8,
	},
	eyeButton: {
		paddingHorizontal: 8,
	},
	saveButton: {
		backgroundColor: colors.primary,
		padding: 12,

		borderRadius: 4,
		margin: 16,
		alignItems: 'center',
	},
	saveButtonText: {
		color: colors.text,
		fontWeight: 'bold',
		fontSize: 16,
		// marginBottom: 16,
	},
})
