/*
 * @Author: zhen qian xhdp123@126.com
 * @Date: 2025-03-06 03:50:53
 * @LastEditors: zhen qian xhdp123@126.com
 * @LastEditTime: 2025-03-06 15:57:00
 * @FilePath: /TuneSync/src/constants/tokens.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const colors = {
	errorColor: 'red',
	primary: '#E76F51',
	background: '#121212',
	text: '#fff',
	textMuted: '#9ca3af',
	icon: '#fff',
	maximumTrackTintColor: 'rgba(255,255,255,0.4)',
	minimumTrackTintColor: 'rgba(255,255,255,0.6)',
	minimumTrackTintColorOnTouch: 'rgba(255,255,255,1)',
	sliderTextOnTouch: 'rgba(255,255,255,1)',
}
export const darkMode = {
	colors: {
		...colors,
	},
}
export const lightMode = {
	colors: {
		...colors,
		primary: '#E76F51',
		background: '#fff',
		text: '#000',
		textMuted: '#9ca3af',
		icon: '#000',
		maximumTrackTintColor: 'rgba(255,255,255,0.4)',
		minimumTrackTintColor: 'rgba(255,255,255,0.6)',
	},
}
export const fontSize = {
	xs: 12,
	sm: 16,
	base: 20,
	lg: 24,
}

export const screenPadding = {
	horizontal: 24,
}
export const screenPaddingXs = {
	horizontal: 24,
}
export const settingPadding = {
	horizontal: 0,
}
