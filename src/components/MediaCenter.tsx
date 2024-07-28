import { unknownTrackImageUri } from '@/constants/images'
import { Playlist } from '@/helpers/types'
import { useIndexStore } from '@/store/library'
import { utilsStyles } from '@/styles'
import { useIsFocused } from '@react-navigation/native'
import { memo, useEffect, useState } from 'react'
import { FlatList, FlatListProps, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { DirectoryItem } from './DirectoryItem'

type MediaCenterProps = {
	data: any
	onDirPress: any
} & Partial<FlatListProps<Playlist>>

const ItemDivider = () => (
	<View style={{ ...utilsStyles.itemSeparator, marginLeft: 40, marginVertical: 12 }} />
)

export const MediaCenter = memo(
	({ data, onDirPress: handleDirPress, ...flatListProps }: MediaCenterProps) => {
		const [pinnedList, setPinnedList] = useState(undefined)
		const { indexingList } = useIndexStore((state) => state)
		const isFocused = useIsFocused()
		useEffect(() => {
			if (isFocused) {
				const el = indexingList
				setPinnedList(el)
			}
			return () => {}
		}, [indexingList, isFocused])
		return (
			<FlatList
				style={{
					padding: 8,
					paddingHorizontal: 12,
				}}
				// keyExtractor={({ item }) => item.filename}
				contentContainerStyle={{ paddingTop: 10, paddingBottom: 128 }}
				ItemSeparatorComponent={ItemDivider}
				ListFooterComponent={ItemDivider}
				ListEmptyComponent={
					<View>
						<Text style={utilsStyles.emptyContentText}>Empty Folder</Text>

						<FastImage
							source={{ uri: unknownTrackImageUri, priority: FastImage.priority.normal }}
							style={utilsStyles.emptyContentImage}
						/>
					</View>
				}
				data={data}
				renderItem={({ item }: any) => {
					const isPinned = (pinnedList || []).some((el: any) => el.dir === item.filename)
					return (
						<DirectoryItem
							mode="edit"
							pinned={isPinned}
							data={item}
							onPress={(dir) => handleDirPress(item)}
						/>
					)
				}}
				{...flatListProps}
			/>
		)
	},
)
