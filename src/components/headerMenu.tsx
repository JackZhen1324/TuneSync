/*
 * @Author: Zhen Qian zqian15@asu.edu
 * @Date: 2024-11-25 13:33:55
 * @LastEditors: zhen qian xhdp123@126.com
 * @LastEditTime: 2025-02-28 15:30:43
 * @FilePath: /TuneSync/src/components/headerMenu.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { MenuView } from '@react-native-menu/menu'
import { PropsWithChildren } from 'react'

type TrackShortcutsMenuProps = PropsWithChildren<{
	refreshLibrary?: any
	data: { id: string; title: string; action: () => void }[]
}>

export const HeaderMemu = ({ data, refreshLibrary, children }: TrackShortcutsMenuProps) => {
	if (!data) return
	const handlePressAction = (id: string) => {
		const action = data.find((el) => el.id === id)?.action
		if (action) {
			action()
		}
	}

	return (
		<MenuView
			onPressAction={({ nativeEvent: { event } }) => handlePressAction(event)}
			actions={data.map(({ id, action, title }) => ({ id, action, title }))}
		>
			{children}
		</MenuView>
	)
}
