import { utilsStyles } from '@/styles'
import React from 'react'
import {
	SafeAreaView,
	SectionList,
	StatusBar,
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
} from 'react-native'
const DATA = [
	{
		title: 'local resource',
		data: ['add location resource'],
	},
	{
		title: 'remote resource',
		data: ['add WebDAV', 'add SMB', 'add FTP', 'add NFS'],
	},
]
const ItemDivider = () => (
	<View style={{ ...utilsStyles.itemSeparator, marginLeft: 0, marginVertical: 0 }} />
)

const ResourceManage = () => (
	<SafeAreaView style={styles.container}>
		<SectionList
			ItemSeparatorComponent={ItemDivider}
			sections={DATA}
			keyExtractor={(item, index) => item + index}
			renderItem={(data) => {
				const { item, index, section } = data
				const isFirst = item === section.data[0]
				const isLast = item === section.data[section.data.length - 1]
				const isSolo = section.data.length === 1
				const style = isSolo
					? styles.itemSolo
					: isFirst
						? styles.itemFirst
						: isLast
							? styles.itemLast
							: styles.item
				return (
					<TouchableHighlight activeOpacity={0.8} onPress={() => {}}>
						<View style={style}>
							<Text style={styles.title}>{item}</Text>
						</View>
					</TouchableHighlight>
				)
			}}
			contentContainerStyle={{ paddingTop: 8 }}
			renderSectionHeader={({ section: { title } }) => <Text style={styles.header}>{title}</Text>}
		/>
	</SafeAreaView>
)

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
		marginBottom: 0,
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
