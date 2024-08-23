// import { PlaylistListItem } from '@/components/PlaylistListItem'
import { unknownTrackImageUri } from '@/constants/images'
import { colors, screenPadding } from '@/constants/tokens'
import { playlistNameFilter } from '@/helpers/filter'
import { useNavigationSearch } from '@/hooks/useNavigationSearch'
import { usePlaylists } from '@/store/library'
import { utilsStyles } from '@/styles'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import ContextMenu from 'react-native-context-menu-view'
import FastImage from 'react-native-fast-image'
import BottomUpPanel from '../BottomUpPanel'
import { AblumListItem } from './AblumListItem'
import useCreatePlaylistModal from './useCreatePlaylistModal'

type AlbumsListProps = {
	albums: any
	onAlbumPress: any
}

export const ItemDivider = () => (
	<View style={{ ...utilsStyles.itemSeparator, marginLeft: 80, marginVertical: 12 }} />
)

export const AlbumsList = ({
	albums,
	onAlbumPress: handleAlbumPress,
	...flatListProps
}: AlbumsListProps) => {
	const search = useNavigationSearch({
		searchBarOptions: {
			placeholder: 'Find in Albums',
		},
	})
	const { t } = useTranslation()
	const { removePlayList } = usePlaylists((state) => state)
	const [isSubmitDisable, setSubmitDisable] = useState(true)
	const [isPanelVisible, setPanelVisible] = useState(false)
	const [handleSubmit, renderCreatePlaylist] = useCreatePlaylistModal({
		setSubmitDisable,
		onClose: () => {
			// panelRef.current.hide()
			setSubmitDisable(true)
			setPanelVisible(false)
		},
	})
	// const [panelRef, render] = useModalView({
	// 	content: renderCreatePlaylist,
	// 	headerLeft: t('playlistAdd.header'),
	// 	headerRight: () => (
	// 		<TouchableOpacity onPress={handleSubmit} disabled={isSubmitDisable}>
	// 			<Text style={isSubmitDisable ? styles.createButtonDisable : styles.createButton}>
	// 				{t('playlistAdd.save')}
	// 			</Text>
	// 		</TouchableOpacity>
	// 	),
	// 	allowDragging: true,
	// })
	const addItem = () => {
		return {
			name: t('collections.addPLaylsit'),
			tracks: [],
			type: 'add',
			artworkPreview: unknownTrackImageUri,
		}
	}

	const filteredAlbums = useMemo(() => {
		return [addItem(), ...albums.filter(playlistNameFilter(search))]
	}, [albums, search])

	return (
		<>
			<FlatList
				contentInsetAdjustmentBehavior="automatic"
				style={{
					paddingHorizontal: screenPadding.horizontal,
				}}
				contentContainerStyle={{ paddingTop: 10, paddingBottom: 128 }}
				ItemSeparatorComponent={ItemDivider}
				// ListFooterComponent={ItemDivider}
				ListEmptyComponent={
					<View>
						<Text style={utilsStyles.emptyContentText}>No album found</Text>
						<FastImage
							source={{ uri: unknownTrackImageUri, priority: FastImage.priority.normal }}
							style={utilsStyles.emptyContentImage}
						/>
					</View>
				}
				data={filteredAlbums}
				renderItem={({ item: playlist }) => {
					if (playlist.type === 'playlist') {
						return (
							<ContextMenu
								actions={[{ title: '删除', systemIcon: 'trash' }]}
								onPress={(e) => {
									if (e.nativeEvent.name === '删除') {
										removePlayList(playlist.name)
									}
								}}
							>
								<AblumListItem
									playlist={playlist}
									onPress={() => {
										const type = playlist.type
										if (type === 'add') {
											setPanelVisible(true)
										} else {
											handleAlbumPress(playlist, type)
										}
									}}
								/>
							</ContextMenu>
						)
					}
					return (
						<AblumListItem
							playlist={playlist}
							onPress={() => {
								const type = playlist.type
								if (type === 'add') {
									setPanelVisible(true)
								} else {
									handleAlbumPress(playlist, type)
								}
							}}
						/>
					)
				}}
				{...flatListProps}
			/>
			<BottomUpPanel
				header={
					<TouchableOpacity
						onPress={() => {
							handleSubmit()
						}}
						style={styles.createButtonContainer}
						disabled={isSubmitDisable}
					>
						<Text
							numberOfLines={1}
							style={isSubmitDisable ? styles.createButtonDisable : styles.createButton}
						>
							{t('playlistAdd.save')}
						</Text>
					</TouchableOpacity>
				}
				isVisible={isPanelVisible}
				onClose={() => setPanelVisible(false)}
				height={600}
			>
				{renderCreatePlaylist()}
			</BottomUpPanel>
		</>
	)
}
const styles = StyleSheet.create({
	modalContent: {
		// backgroundColor: 'white',
		padding: 20,
		borderRadius: 10,
		alignItems: 'center',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		marginBottom: 20,
	},
	cancelButton: {
		color: '#ff3b30',
		fontSize: 16,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	createButton: {
		// padding: 8,
		color: colors.primary,
		fontSize: 16,
		fontWeight: 'bold',

		// zIndex: 100,
	},
	createButtonDisable: {
		color: 'gray',
		fontSize: 16,
		fontWeight: 'bold',
		borderRadius: 15,
		minWidth: 30,
		minHeight: 30,
	},
	createButtonContainer: {
		zIndex: 1000,
		paddingTop: 16,
	},
	iconPicker: {
		marginBottom: 20,
		width: 100,
		height: 100,
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#333',
	},

	iconPreview: {
		width: '100%',
		height: '100%',
		borderRadius: 10,
	},
	input: {
		width: '100%',
		height: 40,
		borderColor: '#333',
		borderRadius: 8,
		paddingHorizontal: 10,
		color: '#333',
		borderBottomWidth: 1,
		// backgroundColor: '#333',
		textAlign: 'center',
	},
	panelContainer: {
		flex: 1,
		// backgroundColor: 'white',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		padding: 16,
	},
})
