import { savePlaybackState } from '@/helpers/playerState'
import { useEffect } from 'react'
import TrackPlayer, { Event } from 'react-native-track-player'

const useSavePlaybackState = () => {
	useEffect(() => {
		const saveState = async () => {
			await savePlaybackState()
		}

		const trackChangedSubscription = TrackPlayer.addEventListener(
			Event.PlaybackTrackChanged,
			saveState,
		)
		const queueEndedSubscription = TrackPlayer.addEventListener(Event.PlaybackQueueEnded, saveState)
		const playbackStateSubscription = TrackPlayer.addEventListener(Event.PlaybackState, saveState)

		return () => {
			trackChangedSubscription.remove()
			queueEndedSubscription.remove()
			playbackStateSubscription.remove()
		}
	}, [])
}

export default useSavePlaybackState
