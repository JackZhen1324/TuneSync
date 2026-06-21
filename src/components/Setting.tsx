import { unknownTrackImageUri } from '@/constants/images'
import { menu } from '@/helpers/types'
import { utilsStyles } from '@/styles'
import { FlatList, FlatListProps, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { MenuItem } from './MenuItem'

type SettingProps = {
	setting: menu[]
	onMenuPress: (playlist: menu) => void
} & Partial<FlatListProps<menu>>

const ItemDivider = () => (
	<View style={{ ...utilsStyles.itemSeparator, marginLeft: 40, marginVertical: 8 }} />
)

export const Setting = ({
	setting = [],
	onMenuPress: handleMenuPress,
	...flatListProps
}: SettingProps) => {
	return (
		<FlatList
			contentContainerStyle={{ paddingTop: 10, paddingBottom: 128 }}
			ItemSeparatorComponent={ItemDivider}
			ListFooterComponent={ItemDivider}
			ListEmptyComponent={
				<View>
					<Text style={utilsStyles.emptyContentText}>No playlist found</Text>

					<FastImage
						source={{ uri: unknownTrackImageUri, priority: FastImage.priority.normal }}
						style={utilsStyles.emptyContentImage}
					/>
				</View>
			}
			data={setting || []}
			renderItem={({ item: menu }) => (
				<MenuItem menu={menu} onPress={() => handleMenuPress(menu)} />
			)}
			{...flatListProps}
		/>
	)
}
