import CollectionsList from '@/components/CollectionsList'
import { defaultStyles } from '@/styles'
import { useGlobalSearchParams } from 'expo-router'
import { StyleSheet, View } from 'react-native'

const AddToPlaylistModal = () => {
	const router = useGlobalSearchParams()
	const targetTrack = router.trackUrl

	return (
		<View style={[styles.modalContainer, { paddingTop: 0 }]}>
			<CollectionsList targetTrack={targetTrack}></CollectionsList>
		</View>
	)
}

const styles = StyleSheet.create({
	modalContainer: {
		...defaultStyles.container,
		paddingTop: 0,
		marginTop: 0,
	},
})

export default AddToPlaylistModal
