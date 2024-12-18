// fallbackMetadataMiddleware.ts
// 若没有artwork，从外部API(如Last.fm)获取数据
import { getSingerInfo, getSongInfo, searchSongs } from '@/service/metadata'
import { titleFormater } from '../../utils'
import { MetadataMiddleware } from '../types'

const singerInfoCache: Record<string, any> = {}

export const fallbackMetadataMiddleware: MetadataMiddleware = async (ctx, next) => {
	const { abortSignal, metadata, params } = ctx
	const configs = {
		api_key: params.middlewareConfigs.key || 'cff50af5e282bff668e6439cc947756f',
		format: 'json',
	}
	if (abortSignal.aborted) throw new Error('Aborted: fallback')

	// 如果已有artwork，则不需要fallback
	if (metadata.artwork) {
		return await next()
	}

	const formatedTitle = titleFormater(metadata.title || params.title || '')
	const { results }: any = await searchSongs(
		{ track: metadata.formatedTitle || formatedTitle },
		configs,
	)
	if (abortSignal.aborted) throw new Error('Aborted: fallbackSearch')

	const matchedTrack = results?.trackmatches?.track?.filter((el: { mbid: any }) => el.mbid)
	const { mbid, artist } = matchedTrack?.[0] || results?.trackmatches?.track?.[0] || {}
	const songInfo: any = await getSongInfo({ mbid: mbid }, configs)
	const { artist: artistInfo } = await getSingerInfo({ artist: artist }, configs)
	if (artistInfo) {
		singerInfoCache[artist] = artistInfo?.image?.map((el) => el['#text']) || []
	}

	const { album, duration } = songInfo?.track ?? {}

	const fallbackArtwork = album?.image?.[3]?.['#text'] || singerInfoCache?.[artist]?.images?.[1]

	metadata.artwork = metadata.artwork || fallbackArtwork
	metadata.artworkMini = metadata.artworkMini || fallbackArtwork
	metadata.artist = metadata.artist || artist
	metadata.artistInfo = {
		images: [{ url: singerInfoCache?.[artist][3] || fallbackArtwork }],
	}

	metadata.genre = formatedTitle
	metadata.album = metadata.album || album?.title
	// metadata.albumImage = album?.image?.[2]?.['#text'] || fallbackArtwork
	metadata.duration = duration
	metadata.playlist = metadata.playlist || [album?.title || 'unknown']
	metadata.pendingMeta = false

	await next()
}
