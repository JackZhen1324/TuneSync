/*
 * @Author: zhen qian xhdp123@126.com
 * @Date: 2024-11-25 13:33:55
 * @LastEditors: zhen qian xhdp123@126.com
 * @LastEditTime: 2025-03-07 00:29:55
 * @FilePath: /TuneSync/src/components/PlaylistToggle/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { MaterialIcons } from '@expo/vector-icons'
import { useState } from 'react'
export default (props: { onPress: any; isPlaylistEnable: any }) => {
	const { onPress, isPlaylistEnable } = props
	const [enable, setEnable] = useState(isPlaylistEnable)

	return (
		<MaterialIcons
			style={{
				marginRight: 6,
				marginBottom: 6,
				flex: 1,
				textAlign: 'right',
				borderRadius: 10,
			}}
			onPress={() => {
				setEnable(!enable)
				if (onPress) {
					onPress(!enable)
				}
			}}
			name="lyrics"
			size={24}
			color={isPlaylistEnable ? 'white' : 'gray'}
		/>
	)
}
