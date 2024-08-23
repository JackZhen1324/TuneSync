// import library from '@/assets/data/library.json'
import { unknownTrackImageUri } from '@/constants/images'
import { debounce } from '@/helpers/debounce'
import { Artist, TrackWithPlaylist } from '@/helpers/types'
import { MaterialIcons, SimpleLineIcons } from '@expo/vector-icons'
import AntDesign from '@expo/vector-icons/AntDesign'
import { uniqBy } from 'lodash'
import { useTranslation } from 'react-i18next'
import { Track } from 'react-native-track-player'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { storage } from './mkkv'
interface LibraryState {
	tracks: TrackWithPlaylist[]
	tracksMap: any
	setTracks: any
	update: any
	toggleTrackFavorite: (track: Track) => void
	addToPlaylist: (track: Track, playlistName: string) => void
}
interface IndexState {
	setNeedUpdate: any
	setIndexingList: any
	indexingList: []
	needUpdate: boolean
	percentage: number
	loading: boolean
	current: string
	setLoading: ({
		loading,
		percentage,
		current,
	}: {
		loading: boolean
		percentage: number
		current: string
	}) => void
}
export const useLibraryStore = create<LibraryState>()(
	persist(
		(set) => {
			return {
				tracks: [],
				tracksMap: {},
				cache: {},
				update: (id, data) => {
					return set((state) => {
						const temp = state.tracksMap
						const cache = state.cache
						temp[id] = { ...temp[id], ...data }
						cache[id] = { ...temp[id], ...data }
						return {
							tracksMap: temp,
							tracks: Object.values(temp),
						}
					})
				},
				reset: () => {
					set({
						tracks: [],
						tracksMap: {},
					})
				},
				setTracks: async (tracks: any) => {
					set({
						tracks: Object.values(tracks),
						tracksMap: tracks,
					})
					set((state: any) => {
						return {
							tracks: Object.values(tracks),
							tracksMap: tracks,
						}
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
		},
		{
			name: 'musicLibrary', // 存储在 AsyncStorage 中的键名
			storage: {
				getItem: (name) => {
					const value = storage.getString(name)
					return value ? JSON.parse(value) : null
				},
				setItem: (name, value) => storage.set(name, JSON.stringify(value)),
				removeItem: (name) => storage.delete(name),
			},
		},
	),
)
export const useIndexStore = create<IndexState>()(
	persist(
		(set) => {
			return {
				current: '',
				needUpdate: false,
				setNeedUpdate: (needUpdate: any) => set({ needUpdate: needUpdate }),
				indexingList: [],
				loading: false,
				setIndexingList: (list: any) => {
					set({
						indexingList: list,
					})
				},
				percentage: 0,
				setLoading: (props) => {
					const { loading, percentage, current } = props
					set({
						loading,
						percentage,
						current,
					})
				},
			}
		},
		{
			name: 'indexList', // 存储在 AsyncStorage 中的键名
			storage: {
				getItem: (name) => {
					const value = storage.getString(name)
					return value ? JSON.parse(value) : null
				},
				setItem: (name, value) => storage.set(name, JSON.stringify(value)),
				removeItem: (name) => storage.delete(name),
			},
		},
	),
)
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
export const useDatasourceConfig = create<any>()(
	persist(
		(set) => {
			return {
				datasourceConfig: [],
				setDatasourceConfig: (configs: any) => {
					set({
						datasourceConfig: configs,
					})
				},
			}
		},
		{
			name: 'datasourceConfig', // 存储在 AsyncStorage 中的键名
			storage: {
				getItem: (name: string) => {
					const value = storage.getString(name)
					return value ? JSON.parse(value) : null
				},
				setItem: (name: string, value: any) => storage.set(name, JSON.stringify(value)),
				removeItem: (name: string) => storage.delete(name),
			},
		},
	),
)
export const useActiveTrack = create<any>()(
	persist(
		(set) => {
			return {
				activeTrackId: 0,
				activeTrack: '',
				activeTrackObj: {},
				setActiveTrack: debounce((track: any, index: number) => {
					if (!track) {
						set({
							activeTrack: '',
							activeTrackObj: undefined,
							activeTrackId: -1,
						})
					} else {
						set({
							activeTrack: track.title,
							activeTrackObj: track,
							activeTrackId: index,
						})
					}
				}, 150),
			}
		},
		{
			name: 'activeTrack', // 存储在 AsyncStorage 中的键名
			storage: {
				getItem: (name: string) => {
					const value = storage.getString(name)
					return value ? JSON.parse(value) : null
				},
				setItem: (name: string, value: any) => storage.set(name, JSON.stringify(value)),
				removeItem: (name: string) => storage.delete(name),
			},
		},
	),
)
export const useTracks = () => useLibraryStore((state) => state)

export const useFavorateStore = create<any>()(
	persist(
		(set) => ({
			favorateTracks: [],
			setFavorateTracks: (tracks: any) => {
				set({ favorateTracks: [...tracks] })
			},
			addTracks: (track: any, favorateTracks: any) => {
				set({ favorateTracks: [...favorateTracks, track] })
			},
		}),
		{
			name: 'favorateTracks', // 存储在 AsyncStorage 中的键名
			storage: {
				getItem: (name) => {
					const value = storage.getString(name)
					return value ? JSON.parse(value) : null
				},
				setItem: (name, value) => storage.set(name, JSON.stringify(value)),
				removeItem: (name) => storage.delete(name),
			},
		},
	),
)

export const useArtists = (tracks: any[] | undefined) => {
	return tracks?.reduce(
		(
			acc: { name: any; tracks: any[]; artistInfo?: any }[],
			track: { artist: any; artistInfo: any },
		) => {
			const existingArtist = acc.find((artist: { name: any }) => artist.name === track.artist)

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
					const index = acc.findIndex((el: { name: string }) => el.name === 'Unknown')

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
		},
		[] as Artist[],
	)
}

export const usePlaylists = create<any>()(
	persist(
		(set) => {
			return {
				playlist: [],
				removePlayList: (name: string) => {
					set((state: { playlist: any[] }) => ({
						playlist: state.playlist.filter((item: { name: string }) => item.name !== name),
					}))
				},
				setPlaylist: (playlist: any[]) => {
					set({
						playlist: uniqBy(playlist, 'name'),
					})
				},
			}
		},
		{
			name: 'playlist', // 存储在 AsyncStorage 中的键名
			storage: {
				getItem: (name: string) => {
					const value = storage.getString(name)
					return value ? JSON.parse(value) : null
				},
				setItem: (name: string, value: any) => storage.set(name, JSON.stringify(value)),
				removeItem: (name: string) => storage.delete(name),
			},
		},
	),
)
export const useAlbums = (tracks: any[]) => {
	const albums = tracks?.reduce(
		(
			acc: { name: string; tracks: any[]; artworkPreview: any; type: string }[],
			track: { playlist: any[]; artwork: any },
		) => {
			track.playlist?.forEach((playlistName: any) => {
				const existingPlaylist = acc.find(
					(playlist: { name: any }) => playlist.name === playlistName,
				)
				if (existingPlaylist) {
					existingPlaylist.tracks.push(track)
				} else {
					acc.push({
						type: 'album',
						name: playlistName,
						tracks: [track],
						artworkPreview: track.artwork ?? unknownTrackImageUri,
					})
				}
			})
			return acc
		},
		[] as any[],
	)

	const addToPlaylist = useLibraryStore((state) => state.addToPlaylist)

	return { albums, addToPlaylist }
}
export const useSetting = () => {
	const { t } = useTranslation()
	return [
		{
			title: t('setting.addSource'),
			id: 'add',
			icon: <AntDesign name="plus" size={24} color="#E76F51" />,
		},
		{
			id: 'folder',
			title: t('setting.folder'),
			icon: <AntDesign name="folder1" size={24} color="#E76F51" />,
		},
		{
			id: 'about',
			title: t('setting.about'),
			icon: <SimpleLineIcons name="info" size={24} color="#E76F51" />,
		},
		{
			id: 'language',
			title: t('setting.language'),
			icon: <MaterialIcons name="language" size={24} color="#E76F51" />,
		},
	]
}
