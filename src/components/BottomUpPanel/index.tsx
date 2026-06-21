import { MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Modal from 'react-native-modal'

const BottomUpPanel = ({ isVisible, onClose, children, header, height = 250 }) => {
	return (
		<Modal isVisible={isVisible} onBackdropPress={onClose} backdropOpacity={0} style={styles.modal}>
			<View style={{ ...styles.panel, minHeight: height }}>
				{header ? (
					<View style={styles.header}>{header}</View>
				) : (
					<TouchableOpacity style={styles.closeButton} onPress={onClose}>
						<MaterialIcons style={styles.closeButton} name="close" size={24} color="white" />
					</TouchableOpacity>
				)}
				{children}
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	modal: {
		justifyContent: 'flex-end',
		margin: 0,
	},
	panel: {
		backgroundColor: '#202020',
		padding: 20,
		paddingTop: 0,
		marginTop: 0,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		minHeight: 200,
		position: 'relative',
	},
	closeButton: {
		position: 'absolute',
		height: 30,
		width: 30,
		top: 10,
		right: 10,
		// backgroundColor: 'white',
		borderRadius: 15,
		padding: 5,
	},
	closeButtonText: {
		fontSize: 20,
		zIndex: 100,
		color: 'white',
	},
})

export default BottomUpPanel
