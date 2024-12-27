import { colors } from '@/constants/tokens'
import { useTrackPlayerQueue } from '@/hooks/useTrackPlayerQueue'
import { defaultStyles } from '@/styles'
import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, Text, View, ViewProps } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import TrackPlayer, { Track } from 'react-native-track-player'

type QueueControlsProps = {
	tracks: Track[]
} & ViewProps

export const QueueControls = ({ tracks, style, ...viewProps }: QueueControlsProps) => {
	const { addTrackToPlayer } = useTrackPlayerQueue()
	const handlePlay = async () => {
		const count = tracks.length
		const randomIndex = Math.floor(Math.random() * count)
		await addTrackToPlayer(tracks[randomIndex])
		const queue = await TrackPlayer.getQueue()
		const index = queue.findIndex((el) => el.basename === tracks[randomIndex].basename)
		await TrackPlayer.skip(index)
		TrackPlayer.play()
	}

	const handleShufflePlay = async () => {
		await TrackPlayer.reset()
		const shuffledTracks = [...tracks].sort(() => Math.random() - 0.5)
		shuffledTracks.forEach(async (el) => {
			await addTrackToPlayer(el)
		})
		await TrackPlayer.play()
	}

	return (
		<View style={[{ flexDirection: 'row', columnGap: 16 }, style]} {...viewProps}>
			{/* Play button */}
			<View style={{ flex: 1 }}>
				<TouchableOpacity onPress={handlePlay} activeOpacity={0.8} style={styles.button}>
					<Ionicons name="play" size={22} color={colors.primary} />

					<Text style={styles.buttonText}>Play</Text>
				</TouchableOpacity>
			</View>

			{/* Shuffle button */}
			<View style={{ flex: 1 }}>
				<TouchableOpacity onPress={handleShufflePlay} activeOpacity={0.8} style={styles.button}>
					<Ionicons name={'shuffle-sharp'} size={24} color={colors.primary} />
					<Text style={styles.buttonText}>Shuffle</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	button: {
		padding: 12,
		backgroundColor: 'rgba(47, 47, 47, 0.5)',
		borderRadius: 8,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		columnGap: 8,
	},
	buttonText: {
		...defaultStyles.text,
		color: colors.primary,
		fontWeight: '600',
		fontSize: 18,
		textAlign: 'center',
	},
})
