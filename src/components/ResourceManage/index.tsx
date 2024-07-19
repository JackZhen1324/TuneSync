import davIcon from '@/assets/icons/dav.png'
import StorageUtil from '@/helpers/storage'
import useThemeColor from '@/hooks/useThemeColor'
import { useCurrentClientStore } from '@/store/library'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { useIsFocused } from '@react-navigation/native'
import { router } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native'
import { List, TouchableRipple } from 'react-native-paper'
const ResourceManage = () => {
	const [added, setAdded] = useState([])
	const { client, setClient } = useCurrentClientStore()
	const isFocused = useIsFocused()
	const onPressOut = useCallback((item: string, mode: string, selected?: string) => {
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
		}
	}, [])

	useEffect(() => {
		if (isFocused) {
			StorageUtil.get('dataSourceConfig').then((res) => {
				setAdded(res || [])
			})
		}
		return () => {}
	}, [isFocused])

	const theme = useThemeColor()
	const renderAddedResource = useMemo(() => {
		return added.map((el: any) => {
			const { location } = el

			return (
				<TouchableRipple
					key={el.location}
					style={{ borderRadius: 4 }}
					borderless
					onPress={() => {
						// debugger
						setClient(el)
						router.push({
							pathname: `/(tabs)/setting/media/${encodeURIComponent('/')}`,
						})
					}}
					rippleColor="rgba(0, 0, 0, .32)"
				>
					<List.Item
						// onPressOut={() => {
						// 	onPressOut('webdav', 'edit', el.location)
						// }}
						style={styles.itemSolo}
						theme={theme}
						title={el.configName}
						right={() => (
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
						)}
						left={() => <List.Icon icon={davIcon} />}
					/>
				</TouchableRipple>
			)
		})
	}, [added, onPressOut, theme])
	return (
		<SafeAreaView style={styles.container}>
			<List.Section theme={theme}>
				<List.Subheader theme={theme}>local resource</List.Subheader>
				<TouchableRipple
					borderless
					style={{ borderRadius: 4 }}
					onPress={() => console.log('Pressed')}
					rippleColor="rgba(0, 0, 0, .32)"
				>
					<List.Item
						onPressOut={() => {
							onPressOut('local resource')
						}}
						style={styles.itemSolo}
						theme={theme}
						title="local"
						left={() => <List.Icon color={theme.colors.primary} icon="plus" />}
					/>
				</TouchableRipple>
				<List.Subheader theme={theme}>remote resource</List.Subheader>
				<TouchableRipple
					style={{ borderRadius: 4 }}
					borderless
					onPress={() => console.log('Pressed')}
					rippleColor="rgba(0, 0, 0, .32)"
				>
					<List.Item
						onPressOut={() => {
							onPressOut('webdav', 'create')
						}}
						style={styles.itemSolo}
						theme={theme}
						title="webdav resource"
						left={() => <List.Icon color={theme.colors.primary} icon="plus" />}
					/>
				</TouchableRipple>
				{added?.length > 0 && <List.Subheader theme={theme}>added resource</List.Subheader>}
				{renderAddedResource}
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
	item: {
		padding: 16,
		paddingHorizontal: 26,
		// marginVertical: 8,
		marginBottom: 0,
		backgroundColor: 'rgba(28,28,30,1)',

		// marginBottom: 20,
	},
	itemSolo: {
		padding: 16,
		paddingHorizontal: 26,
		// marginVertical: 8,
		borderRadius: 6,
		marginBottom: 4,
		backgroundColor: 'rgba(28,28,30,1)',
	},
	itemFirst: {
		padding: 16,
		paddingHorizontal: 26,
		borderTopRightRadius: 6,
		borderTopLeftRadius: 6,
		// marginVertical: 8,
		marginBottom: 0,
		backgroundColor: 'rgba(28,28,30,1)',
	},
	itemLast: {
		padding: 16,
		paddingHorizontal: 26,
		// marginVertical: 8,
		borderBottomLeftRadius: 6,
		borderBottomRightRadius: 6,
		marginBottom: 0,
		backgroundColor: 'rgba(28,28,30,1)',
	},
	header: {
		paddingLeft: 20,
		fontSize: 15,
		color: 'rgba(110,110,115,1)',
		paddingVertical: 8,
	},
	title: {
		padding: 0,
		fontSize: 16,
		color: 'white',
	},
	deleteButton: {
		backgroundColor: 'red',
		justifyContent: 'center',
		alignItems: 'flex-end',
		paddingHorizontal: 20,
	},
	deleteText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
})

export default ResourceManage
