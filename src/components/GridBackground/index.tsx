import { BlurView } from 'expo-blur'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import FastImage from 'react-native-fast-image'

interface GridBackgroundProps {
	uri: string
	children: React.ReactNode
}

const GridBackground: React.FC<GridBackgroundProps> = ({ uri, children }) => {
	return (
		<View style={styles.container}>
			<FastImage source={{ uri: uri }} style={styles.imageBackground}>
				<BlurView intensity={90} style={styles.blur}>
					{children}
				</BlurView>
			</FastImage>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	imageBackground: {
		flex: 1,
		resizeMode: 'cover', // 背景图片适应模式
	},
	blur: {
		...StyleSheet.absoluteFillObject, // 使 BlurView 填满整个背景
	},
	content: {
		width: '100%',
		position: 'absolute',
		left: 0,
		right: 0,
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		fontSize: 16,
		color: '#fff',
		fontWeight: 'bold',
	},
	subText: {
		fontSize: 14,
		color: '#ddd',
		marginTop: 10,
	},
})

export default GridBackground
