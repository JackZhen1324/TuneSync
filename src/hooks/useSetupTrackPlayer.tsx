/*
 * @Author: zhen qian xhdp123@126.com
 * @Date: 2024-11-29 15:48:09
 * @LastEditors: zhen qian xhdp123@126.com
 * @LastEditTime: 2025-03-06 03:16:36
 * @FilePath: /TuneSync/src/hooks/useSetupTrackPlayer.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useEffect, useRef } from 'react'
import TrackPlayer, { Capability, RatingType, RepeatMode } from 'react-native-track-player'

const setupPlayer = async () => {
	await TrackPlayer.setupPlayer({
		maxCacheSize: 2048 * 200,
	})

	await TrackPlayer.updateOptions({
		ratingType: RatingType.Heart,
		capabilities: [
			Capability.Play,
			Capability.Pause,
			Capability.SkipToNext,
			Capability.SkipToPrevious,
			Capability.Stop,
		],
	})

	await TrackPlayer.setVolume(1) // not too loud–
	await TrackPlayer.setRepeatMode(RepeatMode.Queue)
}

export const useSetupTrackPlayer = ({ onLoad }: { onLoad?: () => void }) => {
	const isInitialized = useRef(false)

	useEffect(() => {
		if (isInitialized.current) return
		setupPlayer()
			.then(() => {
				isInitialized.current = true
				onLoad?.()
			})
			.catch((error) => {
				isInitialized.current = false
				console.error(error)
			})
	}, [onLoad])
}
