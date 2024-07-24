import AsyncStorage from '@react-native-async-storage/async-storage'
import TrackPlayer from 'react-native-track-player'

const PLAYBACK_STATE_KEY = 'PLAYBACK_STATE_KEY'

export const initializePlayer = async () => {
	await TrackPlayer.setupPlayer()

	// 恢复播放状态
	const savedState = await AsyncStorage.getItem(PLAYBACK_STATE_KEY)
	if (savedState) {
		const { position, trackId, playing } = JSON.parse(savedState)
		await TrackPlayer.add(trackId)
		await TrackPlayer.seekTo(position)
		if (playing) {
			TrackPlayer.play()
		}
	}
}

export const savePlaybackState = async () => {
	const trackId = await TrackPlayer.getCurrentTrack()
	const position = await TrackPlayer.getPosition()
	const playing = (await TrackPlayer.getState()) === TrackPlayer.STATE_PLAYING

	const state = {
		trackId,
		position,
		playing,
	}

	await AsyncStorage.setItem(PLAYBACK_STATE_KEY, JSON.stringify(state))
}
