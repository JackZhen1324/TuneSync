/*
 * @Author: Zhen Qian zqian15@asu.edu
 * @Date: 2024-12-24 15:15:35
 * @LastEditors: zhen qian xhdp123@126.com
 * @LastEditTime: 2025-03-02 21:57:23
 * @FilePath: /TuneSync/src/helpers/metadata/middleware/fallbackMetadataMiddleware.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// fallbackMetadataMiddleware.ts
// 若没有artwork，从外部API(如Last.fm)获取数据
import { getSingerInfo, getSongInfo, searchSongs } from '@/service/metadata'
import { titleFormater } from '../../utils'
import { MetadataMiddleware } from '../types'
import { getSupportList } from '../utils'

const singerInfoCache: Record<string, any> = {}

export const fallbackMetadataMiddleware: MetadataMiddleware = async (ctx, next) => {
	const { metadata, params } = ctx
	const { signal } = params
	const config = params.middlewareConfigs.find((el) => el.id === 'fallback')
	const supportedList = getSupportList(config?.config)
	const isSupport = supportedList.find((el) => params.title.includes(el))

	if (isSupport && !signal.aborted) {
		const tasks = config?.config?.tasks
		const configs = {
			api_key: config?.config?.apiKey || 'cff50af5e282bff668e6439cc947756f',
			format: 'json',
		}

		const formatedTitle = titleFormater(metadata.title || params.title || '')
		const { results }: any = await searchSongs(
			{ track: metadata.formatedTitle || formatedTitle },
			configs,
		)

		const matchedTrack = results?.trackmatches?.track?.filter((el: { mbid: any }) => el.mbid)
		const { mbid, artist } = matchedTrack?.[0] || results?.trackmatches?.track?.[0] || {}
		const songInfo: any = await getSongInfo({ mbid: mbid }, configs)
		const { artist: artistInfo } = await getSingerInfo({ artist: artist }, configs)
		if (artistInfo) {
			singerInfoCache[artist] = artistInfo?.image?.map((el) => el['#text']) || []
		}

		const { album, duration, name } = songInfo?.track ?? {}
		const fallbackArtwork = album?.image?.[3]?.['#text'] || singerInfoCache?.[artist]?.images?.[1]
		if (tasks?.title) {
			metadata.title = name
			metadata.formatedTitle = name
		}
		if (tasks?.artwork) {
			metadata.artwork = metadata.artwork || fallbackArtwork
			metadata.artworkMini = metadata.artworkMini || fallbackArtwork
		}
		if (tasks?.artist) {
			metadata.artist = metadata.artist || artist
			metadata.artistInfo = {
				images: [{ url: singerInfoCache?.[artist][3] || fallbackArtwork }],
			}
		}

		metadata.genre = formatedTitle
		if (tasks?.album) {
			metadata.album = metadata.album || album?.title
			metadata.playlist = metadata.playlist || [album?.title || 'unknown']
		}
		metadata.duration = duration
		metadata.pendingMeta = false
	}
	await next()
}
