// import library from '@/assets/data/library.json'
import { unknownTrackImageUri } from '@/constants/images'
import { fetchLibrary } from '@/helpers/indexMusic'
import { Artist, Playlist, TrackWithPlaylist } from '@/helpers/types'
import AntDesign from '@expo/vector-icons/AntDesign'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Track } from 'react-native-track-player'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LibraryState {
	tracks: TrackWithPlaylist[]
	setTracks: any
	toggleTrackFavorite: (track: Track) => void
	addToPlaylist: (track: Track, playlistName: string) => void
}
interface IndexState {
	percentage: number
	loading: boolean
	setLoading: ({ loading, percentage }: { loading: boolean; percentage: number }) => void
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
export const useIndexStore = create<IndexState>()((set) => {
	return {
		loading: false,
		percentage: 0,
		setLoading: (props) => {
			const { loading, percentage } = props
			set({
				loading,
				percentage,
			})
		},
	}
})
export const useCurrentClientStore = create<any>()((set) => {
	return {
		client: false,
		setClient: (props: any) => {
			set({
				client: props,
			})
		},
	}
})
export const useSpotofyAuthToken = create<any>()((set) => {
	return {
		token: '',
		setToken: (token: string) => {
			set({
				token: token,
			})
		},
	}
})
export const useActiveTrack = create<any>()(
	persist(
		(set) => {
			return {
				activeTrack: '',
				activeTrackObj: {},
				setActiveTrack: (track: any) => {
					if (!track) {
						set({
							activeTrack: '',
							activeTrackObj: undefined,
						})
					} else {
						set({
							activeTrack: track.title,
							activeTrackObj: track,
						})
					}
				},
			}
		},
		{
			name: 'activeTrack', // 存储在 AsyncStorage 中的键名
			storage: {
				getItem: async (name: string) => {
					const value = await AsyncStorage.getItem(name)
					return value ? JSON.parse(value) : null
				},
				setItem: (name: string, value: any) => AsyncStorage.setItem(name, JSON.stringify(value)),
				removeItem: (name: string) => AsyncStorage.removeItem(name),
			},
		},
	),
)
export const useTracks = () => useLibraryStore((state) => state.tracks)

export const useFavorateStore = create<any>()(
	persist(
		(set) => ({
			favorateTracks: [],
			setFavorateTracks: (tracks: any) => {
				console.log('setFavorateTrackssetFavorateTracks', tracks)

				set({ favorateTracks: [...tracks] })
			},
			addTracks: (track: any, favorateTracks: any) => {
				set({ favorateTracks: [...favorateTracks, track] })
			},
		}),
		{
			name: 'favorateTracks', // 存储在 AsyncStorage 中的键名
			storage: {
				getItem: async (name) => {
					const value = await AsyncStorage.getItem(name)
					return value ? JSON.parse(value) : null
				},
				setItem: (name, value) => AsyncStorage.setItem(name, JSON.stringify(value)),
				removeItem: (name) => AsyncStorage.removeItem(name),
			},
		},
	),
)

export const useArtists = () =>
	useLibraryStore((state) => {
		return state?.tracks?.reduce((acc, track) => {
			const existingArtist = acc.find((artist) => artist.name === track.artist)

			if (existingArtist) {
				existingArtist.tracks.push(track)
			} else {
				if (track.artist) {
					acc.push({
						name: track.artist ?? 'Unknown',
						tracks: [track],
						artistInfo: track?.artistInfo,
					})
				} else {
					const index = acc.findIndex((el) => el.name === 'Unknown')

					if (index === -1) {
						acc.push({
							name: track.artist ?? 'Unknown',
							tracks: [track],
						})
					} else {
						acc[index].tracks.push(track)
					}
				}
			}

			return acc
		}, [] as Artist[])
	})

export const usePlaylists = () => {
	const playlists = useLibraryStore((state) => {
		return state?.tracks?.reduce((acc, track) => {
			track.playlist?.forEach((playlistName) => {
				const existingPlaylist = acc.find((playlist) => playlist.name === playlistName)
				if (existingPlaylist) {
					existingPlaylist.tracks.push(track)
				} else {
					acc.push({
						name: playlistName,
						tracks: [track],
						artworkPreview: track.artwork ?? unknownTrackImageUri,
					})
				}
			})
			return acc
		}, [] as Playlist[])
	})
	const addToPlaylist = useLibraryStore((state) => state.addToPlaylist)

	return { playlists, addToPlaylist }
}
export const useAlbums = () => {
	const albums = useLibraryStore((state) => {
		return state?.tracks?.reduce((acc, track) => {
			track.playlist?.forEach((playlistName) => {
				const existingPlaylist = acc.find((playlist) => playlist.name === playlistName)
				if (existingPlaylist) {
					existingPlaylist.tracks.push(track)
				} else {
					acc.push({
						name: playlistName,
						tracks: [track],
						artworkPreview: track.artwork ?? unknownTrackImageUri,
					})
				}
			})
			return acc
		}, [] as any[])
	})
	const addToPlaylist = useLibraryStore((state) => state.addToPlaylist)

	return { albums, addToPlaylist }
}
export const useSetting = () => {
	return [
		{
			title: 'add source',
			icon: <AntDesign name="plus" size={24} color="#E76F51" />,
		},
		// {
		// 	title: 'general',
		// 	icon: <SimpleLineIcons name="settings" size={24} color="#E76F51" />,
		// },
		// {
		// 	title: 'media library',
		// 	icon: <MaterialIcons name="my-library-music" size={24} color="#E76F51" />,
		// },
	]
}
