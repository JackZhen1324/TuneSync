import { colors } from '@/constants/tokens'
import { useColorScheme } from 'react-native'
import {
	MD2DarkTheme as PaperDarkTheme,
	MD2LightTheme as PaperDefaultTheme,
} from 'react-native-paper'
PaperDarkTheme.colors.primary = colors.primary
export default () => {
	const colorScheme = useColorScheme()
	const isDarkMode = colorScheme === 'dark'
	const theme = isDarkMode ? PaperDarkTheme : PaperDefaultTheme
	return theme
}
