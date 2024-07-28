import { Track } from 'react-native-track-player'

export type Playlist = {
	name: string
	tracks: Track[]
	artworkPreview: string
	type?: string
}
export type menu = {
	title: string
	icon: any
}

export type Artist = {
	name: string
	tracks: Track[]
	artistInfo?: any
}

export type TrackWithPlaylist = Track & { playlist?: string[] }
