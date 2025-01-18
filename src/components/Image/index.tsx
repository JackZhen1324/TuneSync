import { unknownTrackImageUri } from '@/constants/images'
import React, { useState } from 'react'
import { Image as ImageNative, ImageProps, ImageStyle } from 'react-native'
interface FallbackImageProps extends Omit<ImageProps, 'source'> {
	source: string // Primary image source
	fallbackSource?: string // Fallback image source
	style?: ImageStyle // Optional custom styles
}

const Image: React.FC<FallbackImageProps> = ({ source, fallbackSource, style, ...props }) => {
	const [uri, setUri] = useState(source)

	return (
		<ImageNative
			source={{ uri }}
			style={style}
			onError={() => setUri(unknownTrackImageUri)} // Switch to fallback
			{...props}
		/>
	)
}

export default Image
