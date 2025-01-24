import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, PanResponder, StyleSheet, View } from 'react-native'

import {
	DECELERATION_FAST,
	DECELERATION_NORMAL,
	SENSITIVITY_HIGH,
	SENSITIVITY_LOW,
	SENSITIVITY_NORMAL,
} from './constants'

import { useCoverflowStore } from '@/store/coverflow'
import Item from './Item'
import clamp from './clamp'
import convertSensitivity from './convertSensitivity'
import fixChildrenOrder from './fixChildrenOrder'

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
	},
})
type CoverflowProps = {
	scrollX: Animated.Value
	sensitivity?: string
	deceleration?: number
	initialSelection?: number
	spacing?: number
	wingSpan?: number
	rotation?: number
	midRotation?: number
	perspective?: number
	scaleDown?: number
	scaleFurther?: number
	children: any
	onPress?: any
	onChange?: any
	isDetail?: boolean
	style?: any
	setDetail: (isDetail: boolean) => void
}
const Coverflow = ({
	isDetail,
	scrollX,
	sensitivity = SENSITIVITY_NORMAL,
	deceleration = DECELERATION_NORMAL,
	initialSelection = 0,
	spacing = 100,
	wingSpan = 80,
	rotation = 50,
	midRotation = 50,
	perspective = 800,
	scaleDown = 0.8,
	scaleFurther = 0.75,
	children,
	onPress,
	onChange,
	style,
	setDetail,
	...props
}: CoverflowProps) => {
	const [selection, setSelection] = useState(initialSelection)
	const [layoutWidth, setLayoutWidth] = useState(0)
	const scrollStart = useRef(0)
	const [childElements, setChildElements] = useState(
		fixChildrenOrder({ children }, initialSelection),
	)
	const { togleDetail } = useCoverflowStore()
	const sensitivityValue = useMemo(() => convertSensitivity(sensitivity), [sensitivity])
	const scrollPos = useRef(initialSelection)

	const onScroll = useCallback(
		({ value }: { value: number }) => {
			if (Math.abs(scrollPos.current - value) < 10 || scrollStart.current === 0) {
				scrollPos.current = value
				const newSelection = clamp(Math.round(value), 0, React.Children.count(children) - 1)
				if (newSelection !== selection) {
					setSelection(newSelection)
					setChildElements(fixChildrenOrder({ children }, newSelection))
				}
			}
		},
		[selection, children],
	)

	useEffect(() => {
		const listenerId = scrollX.addListener(onScroll)
		return () => {
			scrollX.removeListener(listenerId)
		}
	}, [onScroll, scrollX])

	const snapToPosition = useCallback(
		(pos = scrollPos.current) => {
			const count = React.Children.count(children)
			const finalPos = clamp(Math.round(pos), 0, count - 1)

			if (finalPos !== scrollPos.current) {
				setSelection(finalPos)
				onChange(finalPos)

				Animated.spring(scrollX, {
					toValue: finalPos,
					bounciness: 1,
					useNativeDriver: true,
				}).start(() => {
					scrollX.setValue(finalPos)
				})
			}
		},
		[children, onChange, scrollX],
	)
	const panResponder = useMemo(
		() =>
			PanResponder.create({
				onStartShouldSetPanResponder: () => true,
				onMoveShouldSetPanResponder: (_, gestureState) =>
					Math.abs(gestureState.dx) > 10 && !isDetail,
				onPanResponderGrant: () => {
					scrollX.stopAnimation()
					scrollX.extractOffset()
					scrollStart.current = 1
				},
				onPanResponderMove: (_, gestureState) => {
					if ([0].includes(Math.round(scrollPos.current)) && gestureState.dx > 0) {
						scrollX.setValue(-(gestureState.dx / 1000))
					} else {
						scrollX.setValue(-(gestureState.dx / sensitivityValue))
					}
				},
				onPanResponderRelease: (_, gestureState) => {
					scrollStart.current = 0
					scrollX.flattenOffset()
					const count = React.Children.count(children)
					const newSelection = Math.round(scrollPos.current)

					if (newSelection > 0 && newSelection < count - 2 && Math.abs(gestureState.vx) > 1) {
						const velocity =
							-Math.sign(gestureState.vx) * (clamp(Math.abs(gestureState.vx), 3, 5) / 60)

						Animated.decay(scrollX, {
							velocity,
							deceleration,
							useNativeDriver: true,
						}).start(({ finished }) => {
							if (finished) {
								snapToPosition()
							}
						})
					} else {
						togleDetail(true)
						setDetail(false)
						snapToPosition()
					}
				},
			}),
		[
			isDetail,
			scrollX,
			sensitivityValue,
			children,
			deceleration,
			snapToPosition,
			togleDetail,
			setDetail,
		],
	)
	const onLayout = ({ nativeEvent }: { nativeEvent: { layout: { width: number } } }) => {
		setLayoutWidth(nativeEvent.layout.width)
	}

	const onSelect = useCallback(
		(idx, isDetail) => {
			if (idx === Math.round(scrollPos.current)) {
				onPress?.(idx, isDetail)
			} else {
				snapToPosition(idx)
			}
		},
		[onPress, snapToPosition],
	)

	const renderItem = ([position, item]) => {
		if (!layoutWidth) return null
		const selected = position === selection
		const visible = position > selection - 7 && position < selection + 7
		return visible ? (
			<Item
				key={item.key}
				selected={selected}
				scroll={scrollX}
				position={position}
				spacing={spacing}
				wingSpan={wingSpan}
				rotation={rotation}
				midRotation={midRotation}
				perspective={perspective}
				scaleDown={scaleDown}
				scaleFurther={scaleFurther}
				onSelect={onSelect}
			>
				{item}
			</Item>
		) : null
	}

	return (
		<View
			style={[styles.container, style]}
			onLayout={onLayout}
			{...panResponder.panHandlers}
			{...props}
		>
			{childElements.map(renderItem)}
		</View>
	)
}

Coverflow.propTypes = {
	sensitivity: PropTypes.oneOf([SENSITIVITY_LOW, SENSITIVITY_NORMAL, SENSITIVITY_HIGH]),
	deceleration: PropTypes.oneOf([DECELERATION_NORMAL, DECELERATION_FAST]),
	initialSelection: PropTypes.number,
	spacing: PropTypes.number,
	wingSpan: PropTypes.number,
	rotation: PropTypes.number,
	midRotation: PropTypes.number,
	perspective: PropTypes.number,
	scaleDown: PropTypes.number,
	scaleFurther: PropTypes.number,
	children: PropTypes.arrayOf(PropTypes.element).isRequired,
	onPress: PropTypes.func,
	onChange: PropTypes.func.isRequired,
}

export default Coverflow
