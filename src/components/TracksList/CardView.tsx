/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, useAnimatedValue, View } from 'react-native'

import { unknownTrackImageUri } from '@/constants/images'
import useCollections from '@/hooks/useCollections'
import { utilsStyles } from '@/styles'
import FastImage from 'react-native-fast-image'
import { useSharedValue } from 'react-native-reanimated'
import CoverFlow from '../CoverFlow'
import { SENSITIVITY_LOW } from '../CoverFlow/constants'
import FrostedBackground from '../FrostedBackground'
import Image from '../Image'
import SliderItem from './SlideItem'

/* eslint-disable global-require */

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
	const [spacing] = useState(160)
	const [wingSpan] = useState(40)
	const [rotation] = useState(55)
	const [perspective] = useState(800)
	const [scaleDown] = useState(0.7)
	const [scaleFurther] = useState(0.65)
	const [midRotation] = useState(55)
	const [isDetail, setDetail] = useState(false)
	const { collections } = useCollections()

	const [currentProgress, setProgress] = useState(Math.round(collections.length / 2))
	const progress = useSharedValue(Math.round(collections.length / 2))

	progress.value = currentProgress
	const [selected, setSelected] = useState(collections[Math.round(collections.length / 2)])
	const [imageColors, setImageUrl] = useState(unknownTrackImageUri)
	const scrollX = useRef(useAnimatedValue(collections.length / 2)).current
	// const scrollX = useRef(new Animated.Value(collections.length / 2)).current
	useEffect(() => {
		scrollX.setValue(currentProgress)
	}, [])
	// 处理卡片变更
	const onChange = useCallback(
		(item: number) => {
			setSelected(collections[item])
			setImageUrl(collections[item]?.artworkPreview)
			setDetail(false)
			setProgress(item)
		},
		[collections],
	)

	// 处理卡片点击c
	const onPress = useCallback((item: any, isDetail: boolean) => {
		setDetail(isDetail)
	}, [])

	const getCards = () => {
		const res: JSX.Element[] = []

		collections.forEach((element) => {
			res.push(
				<Image
					key={element?.name}
					source={element.artworkPreview}
					resizeMode="contain"
					style={{
						width: '100%',
						height: '100%',
						resizeMode: 'cover',
						borderRadius: 12,
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
		<FrostedBackground
			setDetail={setDetail}
			source={imageColors}
			selected={isDetail ? {} : selected}
		>
			<CoverFlow
				setDetail={setDetail}
				isDetail={isDetail}
				sensitivity={SENSITIVITY_LOW}
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
				<SliderItem
					data={collections}
					setProgress={setProgress}
					scrollX={scrollX}
					setSelected={setSelected}
					progress={progress}
				></SliderItem>
			)}
		</FrostedBackground>
	)
}
export default CoverFlowDemo
