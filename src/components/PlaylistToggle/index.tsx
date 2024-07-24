import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useState } from 'react'
export default (props: { onPress: any; isPlaylistEnable: any }) => {
	const { onPress, isPlaylistEnable } = props
	const [enable, setEnable] = useState(isPlaylistEnable)

	return (
		<MaterialCommunityIcons
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
			name="format-list-bulleted"
			size={24}
			color={'white'}
		/>
	)
}
