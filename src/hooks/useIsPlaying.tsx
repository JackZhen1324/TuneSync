import { usePlayerStore } from '@/store/player'
import { useDebounceFn } from 'ahooks'
import { useEffect, useState } from 'react'
import { useIsPlaying as getIsPlaying } from 'react-native-track-player'

export const useIsPlaying = () => {
	// 从 Track Player 获取播放状态
	const { playing: trackPlayerPlaying } = getIsPlaying()
	const { playing, setIsPlaying } = usePlayerStore() // 直接调用 usePlayerStore()

	// 使用本地状态监控播放状态
	const [isPlaying, setLocalIsPlaying] = useState(playing)
	const { run } = useDebounceFn(
		(state) => {
			const { playing } = state
			setLocalIsPlaying(playing)
		},
		{ wait: 100 },
	)
	useEffect(() => {
		// 监听 track player 的播放状态变化
		setLocalIsPlaying(trackPlayerPlaying) // 更新本地状态
	}, [trackPlayerPlaying])

	useEffect(() => {
		// 监听 Zustand store 的状态变化
		const unsubscribe = usePlayerStore.subscribe(run)

		return () => unsubscribe() // 清理订阅
	}, [])

	return { playing: isPlaying, setIsPlaying }
}
