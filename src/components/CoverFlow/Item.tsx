import React, { useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import Detail from './Detail'

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		left: 0,
		top: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1,
	},
})
export const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window')
type ItemProps = {
	scroll: Animated.Value
	position: number
	rotation: number
	midRotation: number
	perspective: number
	scaleDown: number
	scaleFurther: number
	wingSpan: number
	spacing: number
	onSelect: (position: number, isDetail: boolean) => void
	selected: boolean
	children?: React.ReactNode // Add this line to include children
}
const Item = (props: ItemProps) => {
	const {
		scroll,
		position,
		rotation,
		midRotation,
		perspective,
		scaleDown,
		scaleFurther,
		wingSpan,
		spacing,
		onSelect,
		selected,
		children,
	} = props

	const [flipAnimation] = useState(new Animated.Value(0))
	const [flipAnimationForScale] = useState(new Animated.Value(0))
	const animatedY = useRef(new Animated.Value(0)).current // 初始高度

	const flipRotateY = useRef(
		flipAnimation.interpolate({
			inputRange: [0, 1],
			outputRange: ['0deg', '180deg'],
		}),
	).current
	const flipScale = useRef(
		flipAnimationForScale.interpolate({
			inputRange: [0, 1],
			outputRange: [1, 1.7],
		}),
	).current
	const [isDetail, setIsDetail] = useState(false)

	useEffect(() => {
		if (!selected && isDetail) {
			setIsDetail(!isDetail)
			Animated.timing(flipAnimation, {
				toValue: 0, // Toggle between 0 (front) and 1 (flipped)
				duration: 300,
				useNativeDriver: true,
			}).start(() => {
				Animated.timing(animatedY, {
					toValue: 0,
					duration: 150,
					useNativeDriver: true,
				}).start(() => {})
				Animated.timing(flipAnimationForScale, {
					toValue: 0, // Toggle between 0 (front) and 1 (flipped)
					duration: 300,
					useNativeDriver: true,
				}).start(() => {})
			})
		}
	}, [animatedY, flipAnimation, flipAnimationForScale, isDetail, selected])

	const style = {
		transform: [
			{ perspective },
			{
				translateX: scroll.interpolate({
					inputRange: [position - 2, position - 1, position, position + 1, position + 2],
					outputRange: [spacing + wingSpan, spacing, 0, -spacing, -spacing - wingSpan],
				}),
			},
			{
				scale: scroll.interpolate({
					inputRange: [position - 2, position - 1, position, position + 1, position + 2],
					outputRange: [scaleFurther, scaleDown, 0.85, scaleDown, scaleFurther],
				}),
			},
			{
				rotateY: flipRotateY,
			},
			{ translateY: animatedY },
			{
				scale: flipScale,
			},

			{
				rotateY: scroll.interpolate({
					inputRange: [
						position - 2,
						position - 1,
						position - 0.5,
						position,
						position + 0.5,
						position + 1,
						position + 2,
					],
					outputRange: [
						`-${rotation}deg`,
						`-${rotation}deg`,
						`-${midRotation}deg`,
						'0deg',
						`${midRotation}deg`,
						`${rotation}deg`,
						`${rotation}deg`,
					],
				}),
			},
		],
	}

	return (
		<TouchableWithoutFeedback
			key={position}
			onPress={() => {
				if (selected) {
					Animated.timing(flipAnimation, {
						toValue: isDetail ? 0 : 1,
						duration: 300,
						useNativeDriver: true,
					}).start(() => {
						Animated.timing(animatedY, {
							toValue: 50,
							duration: 150,
							useNativeDriver: true,
						}).start(() => {})
						Animated.spring(flipAnimationForScale, {
							toValue: isDetail ? 0 : 1,
							// duration: 150,
							bounciness: 1,
							useNativeDriver: true,
						}).start(() => {})
						setTimeout(() => {
							setIsDetail(!isDetail)
						}, 150)
					})
					onSelect(position, !isDetail)
				} else {
					onSelect(position, false)
				}
			}}
		>
			<View
				pointerEvents="box-none"
				style={{
					...styles.container,
				}}
			>
				{isDetail ? (
					<Detail id={position}></Detail>
				) : (
					<Animated.View style={style}>{children}</Animated.View>
				)}
			</View>
		</TouchableWithoutFeedback>
	)
}

export default React.memo(Item, (preP, nextP) => {
	return preP.position === nextP.position && preP.selected === nextP.selected
})
