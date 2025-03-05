/*
 * @Author: zhen qian xhdp123@126.com
 * @Date: 2025-02-14 04:53:47
 * @LastEditors: zhen qian xhdp123@126.com
 * @LastEditTime: 2025-03-06 03:17:14
 * @FilePath: /TuneSync/src/styles/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { colors, fontSize } from '@/constants/tokens'
import { Platform, StyleSheet } from 'react-native'

export const defaultStyles =
	Platform.OS === 'ios'
		? StyleSheet.create({
				container: {
					flex: 1,
					backgroundColor: colors.background,
				},
				text: {
					fontSize: fontSize.base,
					color: colors.text,
				},
			})
		: StyleSheet.create({
				container: {
					top: 40,
					paddingTop: 15,
					flex: 1,
					backgroundColor: colors.background,
				},
				text: {
					fontSize: fontSize.base,
					color: colors.text,
				},
			})

export const utilsStyles = StyleSheet.create({
	centeredRow: {
		marginTop: 40,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	slider: {
		height: 7,
		borderRadius: 16,
	},
	itemSeparator: {
		borderColor: colors.textMuted,
		borderWidth: StyleSheet.hairlineWidth,
		opacity: 0.3,
	},
	emptyContentText: {
		...defaultStyles.text,
		color: colors.textMuted,
		textAlign: 'center',
		marginTop: 20,
	},
	emptyContentImage: {
		width: 200,
		height: 200,
		alignSelf: 'center',
		marginTop: 40,
		opacity: 0.3,
	},
})
