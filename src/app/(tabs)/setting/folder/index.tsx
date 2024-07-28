// GridView.js
import { colors } from '@/constants/tokens'
import { truncateFileName } from '@/helpers/utils'
import { useCurrentClientStore, useIndexStore } from '@/store/library'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import { useIsFocused } from '@react-navigation/native'
import { router } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import { TouchableRipple } from 'react-native-paper'

const numColumns = 3
const size = Dimensions.get('window').width / numColumns - 12

const GridView = () => {
	const [pinnedList, setPinnedList] = useState([] as any)
	const isFocused = useIsFocused()
	const { indexingList } = useIndexStore((state) => state)

	const { setClient } = useCurrentClientStore()
	useEffect(() => {
		if (isFocused) {
			const dirs = indexingList

			setPinnedList(
				(dirs || [])?.map((el: { dir: any; config: any; from: any }) => {
					return {
						title: el?.basename || el.dir.split('/').pop(),
						filename: el.dir,
						key: el.dir,
						config: el.config,
						from: el.from,
					}
				}),
			)
		}
		return () => {}
	}, [indexingList, isFocused])
	const data = useMemo(() => {
		return [
			...pinnedList,
			{ dir: '99999999', title: 'Add source', image: 'https://via.placeholder.com/150' },
		]
	}, [pinnedList])
	const onDirPress = useCallback(
		(item: { filename: string; config: any; from: string }) => {
			const { filename, config, from } = item

			if (from === 'webdav') {
				setClient(config)

				router.push({
					pathname: `/(tabs)/setting/folder/webdav/${encodeURIComponent(filename)}`,
				})
			} else {
				router.push({
					pathname: `/(tabs)/setting/folder/local/${encodeURIComponent(filename)}`,
				})
			}
		},
		[setClient],
	)
	const renderItem = ({ item }) => {
		if (item.title === 'Add source') {
			return (
				<TouchableRipple
					style={{ ...styles.add }}
					onPress={() => {
						router.push('/(tabs)/setting/resource')
					}}
					rippleColor="rgba(0, 0, 0, .32)"
				>
					<View style={styles.item}>
						<MaterialIcons name="add" size={50} color={colors.primary} />
						<Text style={styles.addText}>{item.title}</Text>
					</View>
				</TouchableRipple>
			)
		}
		return (
			<TouchableRipple
				style={styles.item}
				onPress={() => {
					onDirPress(item)
				}}
				rippleColor="rgba(0, 0, 0, .32)"
			>
				<View style={styles.item}>
					<AntDesign name="star" size={24} color={colors.primary} />
					<Text style={styles.title}>{truncateFileName(item.title, 12)}</Text>
				</View>
			</TouchableRipple>
		)
	}

	return (
		<View style={styles.container}>
			<FlatList
				data={data}
				renderItem={renderItem}
				keyExtractor={(item) => item.dir}
				numColumns={numColumns}
				columnWrapperStyle={styles.row}
				style={{ backgroundColor: 'black' }}
				// contentContainerStyle={styles.container}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 5,
		paddingTop: 20,
		backgroundColor: 'black',
		flex: 1,
	},
	item: {
		backgroundColor: '#333',
		alignItems: 'center',
		justifyContent: 'center',
		height: size,
		// flex: 1,
		width: size,
		margin: 5,
		borderRadius: 8,
	},
	add: {
		backgroundColor: '#333',
		alignItems: 'center',
		justifyContent: 'center',
		height: size,
		width: size,
		margin: 5,
		borderRadius: 8,
	},
	addText: {
		fontSize: 14,
		color: colors.icon,
		marginTop: 10,
	},
	title: {
		fontSize: 14,
		color: colors.icon,

		marginTop: 10,
	},
	row: {
		flex: 1,
		justifyContent: 'flex-start',
	},
})

export default GridView
