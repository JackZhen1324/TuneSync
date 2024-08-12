import { getSongInfo, searchSongs } from '@/service/metadata'
import { searchSongsViaSpotify } from '@/service/spotifyMetadata'
import { titleFormater } from '../utils'
const singerInfoCache = {} as any
export async function fetchMetadata(params: { title: string }, token: string) {
	try {
		const { title } = params
		const formatedTitle = titleFormater(title)

		const { results }: any = await searchSongs({
			track: formatedTitle,
		})
		const matchedTrack = results?.trackmatches?.track?.filter((el) => el.mbid)
		const { mbid, image, artist } = matchedTrack?.[0] || results?.trackmatches?.track?.[0] || {}
		const songInfo: any = await getSongInfo({
			mbid: mbid,
		})
		const { url, album, artist: artistObj, duration, ...res } = songInfo?.track ?? {}
		if (!singerInfoCache?.[artist] && artist) {
			const { artists } = await searchSongsViaSpotify(
				{ q: artist, type: 'artist' },
				{
					headers: {
						Authorization: token,
						'Content-Type': 'application/json',
					},
				},
			)
			singerInfoCache[artist] = artists?.items?.[0]
		}

		return {
			artwork: album?.image?.[3]?.['#text'] || singerInfoCache?.[artist]?.images?.[0]?.url,
			artist,
			artistInfo: singerInfoCache?.[artist] || {},
			rating: 0,
			formatedTitle: formatedTitle,
			genre: formatedTitle,
			album: album,
			playlist: [album?.title || 'unknown'],
			duration,
			from: 'webdav',
		}
	} catch (errir) {
		return {}
	}
}
