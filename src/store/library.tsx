// import library from '@/assets/data/library.json'
import { fetchLibrary, indexingDb } from '@/helpers/indexMusic'
import { Artist, TrackWithPlaylist } from '@/helpers/types'
import AntDesign from '@expo/vector-icons/AntDesign'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'
import { Track } from 'react-native-track-player'
import { create } from 'zustand'

interface LibraryState {
	tracks: TrackWithPlaylist[]
	toggleTrackFavorite: (track: Track) => void
	addToPlaylist: (track: Track, playlistName: string) => void
}

export const useLibraryStore = create<LibraryState>()((set) => {
	return {
		tracks: [],
		setTracks: async () => {
			const tracks = await fetchLibrary()
			set({
				tracks: tracks,
			})
		},
		toggleTrackFavorite: (track) =>
			set((state) => ({
				tracks: state.tracks.map((currentTrack) => {
					if (currentTrack.url === track.url) {
						return {
							...currentTrack,
							rating: currentTrack.rating === 1 ? 0 : 1,
						}
					}

					return currentTrack
				}),
			})),
		addToPlaylist: (track, playlistName) =>
			set((state) => ({
				tracks: state.tracks.map((currentTrack) => {
					if (currentTrack.url === track.url) {
						return {
							...currentTrack,
							playlist: [...(currentTrack.playlist ?? []), playlistName],
						}
					}

					return currentTrack
				}),
			})),
	}
})

export const useTracks = () => useLibraryStore((state) => state.tracks)

export const useFavorites = () => {
	const favorites = useLibraryStore(async (state) => {
		// const tracks = await state.setTracks()
		// return [].filter((track) => track.rating === 1)
		return []
	})
	const toggleTrackFavorite = useLibraryStore((state) => state.toggleTrackFavorite)

	return {
		favorites,
		toggleTrackFavorite,
	}
}

export const useArtists = () =>
	useLibraryStore((state) => {
		return state.tracks.reduce((acc, track) => {
			const existingArtist = acc.find((artist) => artist.name === track.artist)

			if (existingArtist) {
				existingArtist.tracks.push(track)
			} else {
				acc.push({
					name: track.artist ?? 'Unknown',
					tracks: [track],
				})
			}

			return acc
		}, [] as Artist[])
	})

export const usePlaylists = () => {
	console.log('indexingDb')

	indexingDb('/')
	const playlists = useLibraryStore((state) => {
		// return state.tracks.reduce((acc, track) => {
		// 	track.playlist?.forEach((playlistName) => {
		// 		const existingPlaylist = acc.find((playlist) => playlist.name === playlistName)
		// 		if (existingPlaylist) {
		// 			existingPlaylist.tracks.push(track)
		// 		} else {
		// 			acc.push({
		// 				name: playlistName,
		// 				tracks: [track],
		// 				artworkPreview: track.artwork ?? unknownTrackImageUri,
		// 			})
		// 		}
		// 	})
		// 	return acc
		// }, [] as Playlist[])
		return []
	})

	const addToPlaylist = useLibraryStore((state) => state.addToPlaylist)

	return { playlists, addToPlaylist }
}
export const useSetting = () => {
	return [
		{
			title: 'add source',
			icon: <AntDesign name="plus" size={24} color="#E76F51" />,
		},
		{
			title: 'general',
			icon: <SimpleLineIcons name="settings" size={24} color="#E76F51" />,
		},
		{
			title: 'media library',
			icon: <MaterialIcons name="my-library-music" size={24} color="#E76F51" />,
		},
	]
}
