import { Artist, Playlist } from './types'

export const trackTitleFilter = (title: string) => (track: any) =>
	track.title?.toLowerCase().includes(title.toLowerCase())

export const artistNameFilter = (name: string) => (artist: Artist) => {
	return artist.name.toLowerCase().includes(name.toLowerCase())
}

export const playlistNameFilter = (name: string) => (playlist: Playlist) => {
	return playlist.name.toLowerCase().includes(name.toLowerCase())
}
