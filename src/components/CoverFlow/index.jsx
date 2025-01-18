import PropTypes from 'prop-types'
import React, { Children, Component } from 'react'
import { Animated, PanResponder, StyleSheet, View } from 'react-native'

import {
	DECELERATION_FAST,
	DECELERATION_NORMAL,
	SENSITIVITY_HIGH,
	SENSITIVITY_LOW,
	SENSITIVITY_NORMAL,
} from './constants'

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

class Coverflow extends Component {
	static propTypes = {
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

	static defaultProps = {
		initialSelection: 0,
		style: undefined,
		sensitivity: SENSITIVITY_NORMAL,
		deceleration: DECELERATION_NORMAL,
		spacing: 100,
		wingSpan: 80,
		rotation: 50,
		midRotation: 50,
		perspective: 800,
		scaleDown: 0.8,
		scaleFurther: 0.75,
		onPress: undefined,
	}

	constructor(props) {
		super(props)

		const sensitivity = convertSensitivity(props.sensitivity)
		this.scrollPos = props.initialSelection
		const scrollX = new Animated.Value(props.initialSelection)
		this.state = {
			width: 0,
			sensitivity,
			scrollX,
			selection: props.initialSelection,
			children: fixChildrenOrder(props, props.initialSelection),
		}
	}

	componentWillMount() {
		const { scrollX, sensitivity } = this.state
		this.scrollListener = scrollX.addListener(this.onScroll)

		this.panResponder = PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: (evt, gestureState) =>
				// Since we want to handle presses on individual items as well
				// Only start the pan responder when there is some movement
				Math.abs(gestureState.dx) > 10,
			onPanResponderGrant: () => {
				scrollX.stopAnimation()
				scrollX.extractOffset()
			},
			onPanResponderTerminationRequest: () => true,
			onPanResponderMove: (evt, gestureState) => {
				// const selection = Math.round(this.scrollPos)

				scrollX.setValue(-(gestureState.dx / sensitivity))

				// this.snapToPosition(0)
				// scrollX.setValue(offset - (gestureState.dx / sensitivity));
			},
			onPanResponderRelease: (evt, gestureState) => {
				scrollX.flattenOffset()

				const count = Children.count(this.props.children)
				const selection = Math.round(this.scrollPos)

				// Damp out the scroll with certain deceleration
				if (selection > 0 && selection < count - 2 && Math.abs(gestureState.vx) > 1) {
					const velocity =
						-Math.sign(gestureState.vx) * (clamp(Math.abs(gestureState.vx), 3, 5) / sensitivity)
					const deceleration = this.props.deceleration

					Animated.decay(scrollX, {
						velocity,
						deceleration,
						useNativeDriver: true,
					}).start(({ finished }) => {
						// Only snap to finish if the animation was completed gracefully
						if (finished) {
							this.snapToPosition()
						}
					})
				} else {
					this.snapToPosition()
				}
			},
		})
	}

	componentWillReceiveProps(nextProps) {
		// Check if the children property changes on addition / removal
		const sensitivity = convertSensitivity(nextProps.sensitivity)
		const selection = clamp(this.state.selection, 0, Children.count(nextProps.children) - 1)
		const children = fixChildrenOrder(nextProps, selection)

		if (this.state.selection !== selection) {
			this.state.scrollX.setValue(selection)
		}

		this.setState({
			selection,
			sensitivity,
			children,
		})
	}

	componentWillUnmount() {
		this.state.scrollX.removeListener(this.listenerId)
	}

	onScroll = ({ value }) => {
		// console.log('onScroll', value)

		// Update the most recent value
		this.scrollPos = value

		const count = this.state.children.length
		const newSelection = clamp(Math.round(value), 0, count - 1)

		if (newSelection !== this.state.selection) {
			console.log('snapToPosition', this.state.selection, newSelection)

			this.setState(
				{
					selection: newSelection,
					children: fixChildrenOrder(this.props, newSelection),
				},
				() => {
					// this.snapToPosition(newSelection)
				},
			)
		}
	}

	onLayout = ({ nativeEvent }) => {
		this.setState({
			width: nativeEvent.layout.width,
		})
	}

	onSelect = (idx) => {
		// Check if the current selection is "exactly" the same
		// this.snapToPosition(0)
		// if (idx === Math.round(this.scrollPos)) {
		// 	console.log('position', idx)
		// 	if (this.props.onPress) {
		// 		this.props.onPress(idx)
		// 	}
		// } else {
		this.snapToPosition(idx)
		// }
	}

	snapToPosition = (pos = this.scrollPos) => {
		const { scrollX, children } = this.state
		const count = children.length

		const finalPos = clamp(Math.round(pos), 0, count - 1)
		if (finalPos !== this.scrollPos) {
			this.setState({ selection: finalPos })
			this.props.onChange(finalPos)

			Animated.spring(scrollX, {
				toValue: finalPos,
				bounciness: 1,
				useNativeDriver: true,
			}).start()
		}
	}

	renderItem = ([position, item]) => {
		item.key = position
		if (!this.state.width) {
			return null
		}

		const { scrollX } = this.state
		const {
			rotation,
			midRotation,
			perspective,
			children,
			scaleDown,
			scaleFurther,
			spacing,
			wingSpan,
		} = this.props
		const count = Children.count(children)

		return (
			<Item
				key={item.key}
				scroll={scrollX}
				position={position}
				count={count}
				spacing={spacing}
				wingSpan={wingSpan}
				rotation={rotation}
				midRotation={midRotation}
				perspective={perspective}
				scaleDown={scaleDown}
				scaleFurther={scaleFurther}
				onSelect={this.onSelect}
			>
				{item}
			</Item>
		)
	}

	render() {
		const {
			style,
			rotation,
			midRotation,
			scaleDown,
			scaleFurther,
			perspective,
			spacing,
			wingSpan,
			...props
		} = this.props
		const { children } = this.state

		return (
			<View
				style={[styles.container, style]}
				{...props}
				onLayout={this.onLayout}
				{...this.panResponder.panHandlers}
			>
				{children.map(this.renderItem)}
			</View>
		)
	}
}

export default Coverflow
