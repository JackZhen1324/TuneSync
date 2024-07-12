import davIcon from '@/assets/icons/dav.png'
import StorageUtil from '@/helpers/storage'
import useThemeColor from '@/hooks/useThemeColor'
import { utilsStyles } from '@/styles'
import { router } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native'
import { List, TouchableRipple } from 'react-native-paper'

const ItemDivider = () => (
	<View style={{ ...utilsStyles.itemSeparator, marginLeft: 0, marginVertical: 0 }} />
)

const ResourceManage = () => {
	const [added, setAdded] = useState([])
	const onPressOut = useCallback((item: string) => {
		console.log('item', item)

		switch (item) {
			case 'webdav':
				router.push('/setting/add/webdav')
		}
	}, [])
	useEffect(() => {
		StorageUtil.get('dataSourceConfig').then((res) => {
			setAdded(res)
		})
	})

	console.log('addedData', added)

	const theme = useThemeColor()
	const renderAddedResource = useMemo(() => {
		return added.map((el: any, index) => {
			return (
				<TouchableRipple
					key={el.address}
					style={{ borderRadius: 4 }}
					borderless
					onPress={() => console.log('Pressed')}
					rippleColor="rgba(0, 0, 0, .32)"
				>
					<List.Item
						onPressOut={() => {
							onPressOut('webdav')
						}}
						style={styles.itemSolo}
						theme={theme}
						title={el.configName}
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
							onPressOut('webdav')
						}}
						style={styles.itemSolo}
						theme={theme}
						title="webdav resource"
						left={() => <List.Icon color={theme.colors.primary} icon="plus" />}
					/>
				</TouchableRipple>
				<List.Subheader theme={theme}>added resource</List.Subheader>
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
})

export default ResourceManage
