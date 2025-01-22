import { unknownTrackImageUri } from '@/constants/images'
import React, { useState } from 'react'
import { ImageProps, ImageStyle } from 'react-native'
import FastImage from 'react-native-fast-image'
interface FallbackImageProps extends Omit<ImageProps, 'source'> {
	source: string // Primary image source
	fallbackSource?: string // Fallback image source
	style?: ImageStyle // Optional custom styles
}

const Image: React.FC<FallbackImageProps> = ({ source, fallbackSource, style, ...props }) => {
	const [uri, setUri] = useState(source)

	return (
		<FastImage
			source={{
				uri: uri,
				priority: FastImage.priority.high,
			}}
			onError={() => setUri(fallbackSource || unknownTrackImageUri)}
			style={style}
			{...props}
		/>
		// <ImageNative
		// 	source={{ uri }}
		// 	style={style}
		// 	onError={() => setUri(unknownTrackImageUri)} // Switch to fallback
		// 	{...props}
		// />
	)
}

export default Image
