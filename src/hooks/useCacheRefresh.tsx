/*
 * @Author: Zhen Qian zqian15@asu.edu
 * @Date: 2025-01-27 19:12:37
 * @LastEditors: Zhen Qian zqian15@asu.edu
 * @LastEditTime: 2025-01-27 19:13:52
 * @FilePath: /TuneSync/src/hooks/useCacheRefresh.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { usePlayerStore } from '@/store/player'
import TrackPlayer from 'react-native-track-player'

export default () => {
	const { fireCacheResetTrigger } = usePlayerStore((state) => state)
	const cacheRefresh = () => {
		TrackPlayer.retry()
			.then(() => {
				fireCacheResetTrigger()
			})
			.finally(() => {
				TrackPlayer.play()
			})
	}
	return { cacheRefresh }
}
