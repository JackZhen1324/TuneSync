import { MaterialCommunityIcons } from '@expo/vector-icons'
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import { BlurView } from 'expo-blur'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, Text, View } from 'react-native'
type CustomBottomSheet = {
	onClose?: () => void
	headerRight?: () => React.ReactNode
	headerLeft?: React.ReactNode
	content?: React.ReactNode
	modalRef?: React.Ref<BottomSheet> // 添加 modalRef
}
const CustomBottomSheet: React.FC<CustomBottomSheet> = (props) => {
	const { modalRef, content, onClose, headerRight, headerLeft } = props
	const { t } = useTranslation()

	// variables
	const snapPoints = useMemo(() => ['1%', '50%', '70%', '90%'], [])
	const renderBackdrop = useCallback(
		(props) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
				opacity={0}
				pressBehavior="close" // 这里让点击空白区域关闭 BottomSheet
			/>
		),
		[],
	)
	return (
		<BottomSheet
			enablePanDownToClose={true}
			handleStyle={{ display: 'none' }}
			enableHandlePanningGesture={false}
			backgroundStyle={{ backgroundColor: 'transparent' }}
			ref={modalRef}
			index={0}
			snapPoints={snapPoints}
			enableDynamicSizing={false}
			backdropComponent={renderBackdrop}
		>
			<BlurView
				intensity={80}
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
						<Pressable
							style={styles.closeButton}
							onPress={() => {
								if (onClose) {
									onClose()
								}
							}}
						>
							<MaterialCommunityIcons name="window-close" size={24} color="white" />
						</Pressable>
					)}
				</View>
				{content}
			</BlurView>
		</BottomSheet>
		// </GestureHandlerRootView>
	)
}
const styles = StyleSheet.create({
	panelContainer: {
		// flex: 1,
		// backgroundColor: 'white',
		borderTopLeftRadius: 14,
		borderTopRightRadius: 14,
		padding: 16,
	},
	itemContainer: {
		padding: 6,
		margin: 6,
		backgroundColor: '#eee',
	},
	container: {
		flex: 1,
		padding: 24,
		justifyContent: 'center',
		backgroundColor: 'grey',
	},
	contentContainer: {
		flex: 1,
		alignItems: 'center',
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
export default CustomBottomSheet
