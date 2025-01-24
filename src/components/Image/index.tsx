import { unknownTrackImageUri } from '@/constants/images'
import React, { useState } from 'react'
import { Dimensions, ImageProps, ImageStyle, View } from 'react-native'
import FastImage from 'react-native-fast-image'
interface FallbackImageProps extends Omit<ImageProps, 'source'> {
	source: string // Primary image source
	fallbackSource?: string // Fallback image source
	style?: ImageStyle // Optional custom styles
}

const Image: React.FC<FallbackImageProps> = ({ source, fallbackSource, style, ...props }) => {
	const [uri, setUri] = useState(source)
	const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window')
	return (
		<View
			style={{
				width: SCREEN_HEIGHT * 0.6,
				height: SCREEN_HEIGHT * 0.6,
				transform: [{ translateY: -20 }],
			}}
		>
			<FastImage
				source={{
					uri: uri,
					priority: FastImage.priority.high,
				}}
				onError={() => setUri(fallbackSource || unknownTrackImageUri)}
				style={style}
				{...props}
			/>
		</View>
	)
}

export default Image
