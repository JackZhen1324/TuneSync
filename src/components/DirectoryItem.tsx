import { colors } from '@/constants/tokens'
import { menu } from '@/helpers/types'
import useThemeColor from '@/hooks/useThemeColor'
import { useCurrentClientStore } from '@/store/library'
import { defaultStyles } from '@/styles'
import { AntDesign } from '@expo/vector-icons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCallback, useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableHighlight, TouchableHighlightProps, View } from 'react-native'

type DirectoryItemProps = {
	menu: menu
} & TouchableHighlightProps

export const DirectoryItem = ({ data, pinned, ...props }: DirectoryItemProps) => {
	const { basename, type, isActive } = data
	const { client: config } = useCurrentClientStore()
	const [isPinned, setIsPinned] = useState(pinned)
	useEffect(() => {
		setIsPinned(pinned)
	}, [pinned])

	const theme = useThemeColor()
	const renderIcon = useCallback((el) => {
		if (el?.mime?.includes('audio')) {
			return (
				<MaterialCommunityIcons name="folder-music-outline" size={24} color={theme.colors.text} />
			)
		} else if (el.type === 'directory') {
			return <MaterialCommunityIcons name="folder-outline" size={24} color={theme.colors.text} />
		}
		return <MaterialCommunityIcons name="file-chart-outline" size={24} color={theme.colors.text} />
	}, [])
	return (
		<TouchableHighlight key={basename} activeOpacity={0.8} {...props}>
			<View key={basename} style={styles.dirListItemContainer}>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						width: '100%',
					}}
				>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'flex-start',
							alignItems: 'center',
							width: '100%',
						}}
					>
						{renderIcon(data)}
						<Text numberOfLines={1} style={styles.dirNameText}>
							{data?.basename}
						</Text>
					</View>
					{type === 'directory' ? (
						<TouchableHighlight
							onPress={async (e) => {
								e.stopPropagation()
								setIsPinned(!isPinned)
								let el = (await AsyncStorage.getItem('indexList')) as any
								el = JSON.parse(el || '[]')
								if (!isPinned) {
									if (el) {
										el.push({ dir: data.filename, config })
										AsyncStorage.setItem('indexList', JSON.stringify(el))
									} else {
										AsyncStorage.setItem(
											'indexList',
											JSON.stringify([{ dir: data.filename, config }]),
										)
									}
								} else {
									el = el.filter((e: { dir: any }) => e.dir !== data.filename)
									AsyncStorage.setItem('indexList', JSON.stringify(el))
								}
							}}
						>
							<View>
								{isPinned ? (
									<AntDesign name="star" color={colors.primary} size={20} style={{ opacity: 1 }} />
								) : (
									<AntDesign name="staro" color={colors.icon} size={20} style={{ opacity: 1 }} />
								)}
							</View>
						</TouchableHighlight>
					) : (
						''
					)}
				</View>
			</View>
		</TouchableHighlight>
	)
}

const styles = StyleSheet.create({
	dirListItemContainer: {
		flexDirection: 'row',
		columnGap: 14,
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingRight: 20,
	},
	playlistArtworkImage: {
		borderRadius: 8,
		width: 70,
		height: 70,
	},
	dirNameText: {
		...defaultStyles.text,
		paddingLeft: 16,
		fontSize: 17,
		fontWeight: '600',
		// maxWidth: '80%',
	},
})
