import { useAlbums, usePlaylists, useTracks } from '@/store/library'
import { useMemo } from 'react'

export default () => {
	const { tracks } = useTracks()
	const { albums } = useAlbums(tracks)
	const { playlist } = usePlaylists((state) => state)
	const collections = useMemo(() => {
		return [...playlist, ...albums]
	}, [albums, playlist])

	return { collections }
}
