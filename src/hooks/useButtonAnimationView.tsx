import React, { useRef } from 'react'
import { Animated, TouchableOpacity } from 'react-native'

const ButtonAnimationView = ({ children, style }) => {
	const scaleAnim = useRef(new Animated.Value(1)).current // 创建动画值

	const handlePressIn = () => {
		Animated.spring(scaleAnim, {
			toValue: 0.5, // 按钮缩小
			bounciness: 10,
			useNativeDriver: true,
		}).start()
	}

	const handlePressOut = () => {
		Animated.spring(scaleAnim, {
			toValue: 1, // 恢复到原始大小
			bounciness: 10,
			useNativeDriver: true,
		}).start()
	}

	return (
		<Animated.View style={[style, { transform: [{ scale: scaleAnim }] }]}>
			<TouchableOpacity onPressIn={handlePressIn} onPressOut={handlePressOut}>
				{children}
			</TouchableOpacity>
		</Animated.View>
	)
}

export default ButtonAnimationView
