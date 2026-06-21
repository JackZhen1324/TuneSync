import { useWindowDimensions } from 'react-native'

export const useIsLandscape = () => {
	const { height, width } = useWindowDimensions()
	const isLandscape = width > height
	return isLandscape
}
