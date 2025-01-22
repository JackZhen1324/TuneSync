/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { useCallback, useEffect, useState } from 'react'
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native'

import { unknownTrackImageUri } from '@/constants/images'
import { colors } from '@/constants/tokens'
import useCollections from '@/hooks/useCollections'
import { utilsStyles } from '@/styles'
import { Slider } from 'react-native-awesome-slider'
import FastImage from 'react-native-fast-image'
import { useSharedValue } from 'react-native-reanimated'
import CoverFlow from '../CoverFlow'
import FrostedBackground from '../FrostedBackground'
import Image from '../Image'

/* eslint-disable global-require */
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window')
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	item: {
		width: 64 * 2.5,
		height: 64 * 2.5,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'blue',
		borderWidth: 2,
		borderColor: '#fff',
	},
	itemText: {
		fontSize: 24,
		color: '#fff',
		fontWeight: 'bold',
	},
	sliderBar: {
		position: 'absolute',
		bottom: 30,
		left: 30,
		right: 30,
		height: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	sliderTrack: {
		width: '100%',
		height: 4,
		backgroundColor: '#bdc3c7',
		borderRadius: 2,
	},
	sliderThumb: {
		position: 'absolute',
		width: 20,
		height: 20,
		backgroundColor: '#2ecc71',
		borderRadius: 10,
	},
})

const CoverFlowDemo = () => {
	const [spacing] = useState(180)
	const [wingSpan] = useState(40)
	const [rotation] = useState(45)
	const [perspective] = useState(800)
	const [scaleDown] = useState(0.7)
	const [scaleFurther] = useState(0.65)
	const [midRotation] = useState(0)
	const [isDetail, setDetail] = useState(false)
	const { collections } = useCollections()
	const min = useSharedValue(0)
	const max = useSharedValue(collections.length - 1)
	const [currentProgress, setProgress] = useState(Math.round(collections.length / 2))
	const progress = useSharedValue(Math.round(collections.length / 2))
	useEffect(() => {
		scrollX.setValue(currentProgress)
	}, [])
	progress.value = currentProgress
	const [selected, setSelected] = useState(collections[Math.round(collections.length / 2)])
	const [imageColors, setImageUrl] = useState(unknownTrackImageUri)
	const [scrollX] = useState(new Animated.Value(collections.length / 2))

	// 处理卡片变更
	const onChange = useCallback(
		(item) => {
			setSelected(collections[item])
			setImageUrl(collections[item]?.artworkPreview)
			setDetail(false)
			setProgress(item)
		},
		[collections],
	)

	// 处理卡片点击
	const onPress = useCallback((item, isDetail) => {
		setDetail(isDetail)
	}, [])

	const getCards = () => {
		const res = []

		collections.forEach((element) => {
			res.push(
				<Image
					key={element?.name}
					source={element.artworkPreview}
					resizeMode="contain"
					style={{
						width: 250,
						alignItems: 'center',
						justifyContent: 'center',
						height: '80%',
						borderRadius: 20,
					}}
				/>,
			)
		})

		return res
	}

	return collections.length <= 0 ? (
		<View style={{ backgroundColor: 'black', flex: 1 }}>
			<Text style={utilsStyles.emptyContentText}>No album found</Text>
			<FastImage
				source={{ uri: unknownTrackImageUri, priority: FastImage.priority.normal }}
				style={utilsStyles.emptyContentImage}
			/>
		</View>
	) : (
		<FrostedBackground source={imageColors} selected={isDetail ? {} : selected}>
			<CoverFlow
				scrollX={scrollX}
				style={styles.container}
				onChange={onChange}
				onPress={onPress}
				spacing={spacing}
				wingSpan={wingSpan}
				rotation={rotation}
				midRotation={midRotation}
				scaleDown={scaleDown}
				scaleFurther={scaleFurther}
				perspective={perspective}
				initialSelection={Math.round(collections.length / 2)}
			>
				{getCards()}
			</CoverFlow>

			{!isDetail && (
				<Slider
					style={{
						position: 'absolute',
						width: SCREEN_WIDTH * 0.7,
						left: SCREEN_WIDTH * 0.15,
						bottom: 40,
						zIndex: 999,
					}}
					onValueChange={(value) => {
						setProgress(value)
						scrollX.setValue(value)
					}}
					onSlidingComplete={(value) => {
						scrollX.setValue(Math.round(value))
						setProgress(Math.round(value))
					}}
					thumbWidth={20}
					progress={progress}
					maximumValue={max}
					minimumValue={min}
					containerStyle={utilsStyles.slider}
					theme={{
						maximumTrackTintColor: colors.maximumTrackTintColor,
						minimumTrackTintColor: colors.minimumTrackTintColor,
					}}
				></Slider>
			)}
		</FrostedBackground>
	)
}
export default CoverFlowDemo
