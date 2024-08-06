import { MaterialCommunityIcons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import React, { ReactNode, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
import SlidingUpPanel from 'rn-sliding-up-panel'
type useModalView = {
	content: () => ReactNode
	headerLeft: string
	headerRight: () => ReactNode
	allowDragging: boolean
}
const useModalView = (props: useModalView) => {
	const { content, headerLeft, headerRight, allowDragging = false, ...res } = props
	// const [modalVisible, setModalVisible] = useState(false)
	const panelRef = useRef(null)
	const { t } = useTranslation()
	const render = () => {
		return (
			<SlidingUpPanel
				allowDragging={allowDragging}
				ref={panelRef}
				draggableRange={{ top: Dimensions.get('window').height * 0.7, bottom: 0 }}
				{...res}
			>
				<BlurView
					intensity={95}
					style={{
						...StyleSheet.absoluteFillObject,
						overflow: 'hidden',
						...styles.panelContainer,
					}}
				>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignContent: 'center',
						}}
					>
						<Text style={styles.panelTitle}>
							{headerLeft ? headerLeft : t('player.playlist.header')}
						</Text>
						{/* Add your playlist component here */}
						{headerRight ? (
							headerRight()
						) : (
							<Pressable style={styles.closeButton} onPress={() => panelRef.current.hide()}>
								<MaterialCommunityIcons name="window-close" size={24} color="white" />
							</Pressable>
						)}
					</View>
					{content && content()}
					{/* <PlaylistsList></PlaylistsList> */}
				</BlurView>
			</SlidingUpPanel>
		)
	}
	return [panelRef, render]
}

const styles = StyleSheet.create({
	header: {
		display: 'flex',
		justifyContent: 'center',
		color: 'white',
	},
	artworkImageContainer: {
		shadowOffset: {
			width: 0,
			height: 8,
		},
		shadowOpacity: 0.44,
		shadowRadius: 11.0,
		flexDirection: 'row',
		justifyContent: 'center',
		height: '45%',
	},
	artworkImage: {
		width: '100%',
		height: '100%',
		resizeMode: 'cover',
		borderRadius: 12,
	},
	trackTitleContainer: {
		flex: 1,
		overflow: 'hidden',
	},

	panelContainer: {
		flex: 1,
		// backgroundColor: 'white',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		padding: 16,
	},
	panelTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: 'white',
		paddingVertical: 8,
		// paddingHorizontal: 16,
		paddingLeft: 8,
		marginBottom: 16,
	},
	closeButton: {
		// marginTop: 16,
		// backgroundColor: colors.primary,
		borderRadius: 8,
		paddingVertical: 8,
		paddingHorizontal: 16,
		paddingRight: 8,
		alignSelf: 'center',
	},
	closeButtonText: {
		color: 'white',
		fontSize: 16,
	},
})
export default useModalView
