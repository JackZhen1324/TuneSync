import React, { useState } from 'react'
import { Animated, Dimensions, StyleSheet, TouchableWithoutFeedback } from 'react-native'

import { colors } from '@/constants/tokens'
import { debounce } from '@/helpers/debounce'
import { throttle } from '@/helpers/utils'
import { utilsStyles } from '@/styles'
import { Slider } from 'react-native-awesome-slider'
import { SharedValue, useSharedValue } from 'react-native-reanimated'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	sliderBar: {
		position: 'absolute',

		bottom: 40,
		zIndex: 999,
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

interface SliderItemProps {
	progress: SharedValue<number>
	data: any[]
	scrollX: any
	setProgress: (value: number) => void
	setSelected: (item: any) => void
}

const SliderItem: React.FC<SliderItemProps> = (props) => {
	const { width: SCREEN_WIDTH } = Dimensions.get('window')
	const { progress, data: collections, scrollX, setProgress, setSelected } = props
	const min = useSharedValue(0)
	const max = useSharedValue(collections.length - 1)
	// State for the timer ID
	const [timer, setTimer] = useState(null)
	// Animated value for the slider's opacity
	const sliderOpacity = useState(new Animated.Value(0))[0]
	const [sliderVisible, setSliderVisible] = useState(false)

	// Show slider when user presses the bottom of the screen
	const onTouchStart = () => {
		if (!sliderVisible) {
			setSliderVisible(true)
			Animated.timing(sliderOpacity, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true,
			}).start()
		}
		scheduleTohide()
	}
	const scheduleTohide = debounce(() => {
		if (timer) {
			clearTimeout(timer)
		}

		// Set a new timer to hide the slider after 3 seconds
		const newTimer = setTimeout(hideSlider, 3000)
		setTimer(newTimer) // Save the new timer ID
	}, 100)
	// Hide slider with fade-out effect
	const hideSlider = () => {
		Animated.timing(sliderOpacity, {
			toValue: 0,
			duration: 300,
			useNativeDriver: true,
		}).start(() => setSliderVisible(false))
	}

	return (
		<TouchableWithoutFeedback
			onPress={onTouchStart}
			style={[
				styles.container,
				{
					position: 'absolute',
					width: SCREEN_WIDTH * 0.7,
					left: SCREEN_WIDTH * 0.15,
					bottom: 0,
					zIndex: 999,
				},
			]}
		>
			<Animated.View
				style={[
					styles.sliderBar,
					{ opacity: sliderOpacity },
					{ width: SCREEN_WIDTH * 0.7, left: SCREEN_WIDTH * 0.15 },
				]}
			>
				<Slider
					onValueChange={throttle((value: number) => {
						onTouchStart()
						setProgress(value)
						scrollX.setValue(value)
						setSelected(collections[Math.round(value)])
					}, 500)}
					onSlidingComplete={(value) => {
						scrollX.stopAnimation()
						setProgress(Math.round(value))
						scrollX.setValue(Math.round(value))
					}}
					renderMark={() => null}
					renderBubble={() => null}
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
			</Animated.View>
		</TouchableWithoutFeedback>
	)
}

export default SliderItem
