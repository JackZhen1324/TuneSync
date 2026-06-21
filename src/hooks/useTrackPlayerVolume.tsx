/*
 * @Author: zhen qian xhdp123@126.com
 * @Date: 2024-11-25 13:33:55
 * @LastEditors: zhen qian xhdp123@126.com
 * @LastEditTime: 2025-03-06 17:08:41
 * @FilePath: /TuneSync/src/hooks/useTrackPlayerVolume.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useCallback, useEffect, useState } from 'react'
import SystemSetting from 'react-native-system-setting'

export const useTrackPlayerVolume = () => {
	const [volume, setVolume] = useState<number | undefined>(undefined)
	const updateVolume = useCallback(async (newVolume: number) => {
		if (newVolume < 0 || newVolume > 1) return

		setVolume(newVolume)

		await SystemSetting.setVolume(newVolume)
	}, [])

	useEffect(() => {
		// 获取当前系统音量
		SystemSetting.getVolume().then(setVolume)

		// 监听音量变化
		const volumeListener = SystemSetting.addVolumeListener((data) => {
			setVolume(data.value)
		})

		return () => {
			// 组件卸载时移除监听器
			SystemSetting.removeVolumeListener(volumeListener)
		}
	}, [])

	// useEffect(() => {
	// 	getVolume()
	// }, [getVolume])

	return { volume, updateVolume }
}
