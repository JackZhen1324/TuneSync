import ImageResizer from 'react-native-image-resizer'

export const resizeBase64Image = async (
	base64Str: string,
	outputWidth: number,
	outputHeight: number,
) => {
	try {
		// 使用 react-native-image-resizer 重新调整图像大小
		const smallImage = await ImageResizer.createResizedImage(
			base64Str,
			outputWidth,
			outputHeight,
			'PNG', // 输出格式
			100, // 图片质量 (1-100)
		)
		// 使用 react-native-image-resizer 重新调整图像大小
		const bigImage = await ImageResizer.createResizedImage(
			base64Str,
			outputWidth * 10,
			outputHeight * 10,
			'PNG', // 输出格式
			100, // 图片质量 (1-100)
		)
		// 直接返回调整大小后图片的文件路径
		return [smallImage.uri, bigImage.uri]
	} catch (error) {
		console.error('Error resizing image:', error)
		return []
	}
}
