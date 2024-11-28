import { getSongInfo, searchSongs } from '@/service/metadata'
import { extractMetadataFromURL } from 'awesome-module'
import { resizeBase64Image } from '../imageTools'
import { titleFormater } from '../utils'

const singerInfoCache = {} as any
const mockLongRequest = async () => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve('Request completed successfully!')
		}, 400) // 5-second delay/
	})
}
export async function fetchMetadata(
	params: { title: string; webdavUrl: string },
	abortSignal: AbortSignal,
	cache: any,
) {
	try {
		if (abortSignal.aborted) throw new Error('Aborted1')
		const { title, webdavUrl } = params
		if (cache?.[title]) {
			await mockLongRequest()
			return cache[title]
		}
		// Download the file using react-native-fs
		const { artwork: rawImage, ...metadata } = (await extractMetadataFromURL(webdavUrl)) as any

		const artworkRaw = `data:image/jpeg;base64,${rawImage}`
		const [compressedImage, artwork] = rawImage ? await resizeBase64Image(artworkRaw, 40, 40) : []

		const formatedMetadata = {
			title: metadata?.title ?? title,
			artist: metadata.artist,
			playlist: [metadata.albumName || 'Unknown'],
			album: metadata.albumName,
			artwork: artwork,
			artworkMini: compressedImage,
		}

		const formatedTitle = titleFormater(title)
		if (abortSignal.aborted) throw new Error('Aborted2')
		// Parse the binary data to get the metadata
		if (!rawImage) {
			const { results }: any = await searchSongs({
				track: metadata.title || formatedTitle,
			})
			const matchedTrack = results?.trackmatches?.track?.filter((el: { mbid: any }) => el.mbid)
			if (abortSignal.aborted) throw new Error('Aborted3')
			const { mbid, artist } = matchedTrack?.[0] || results?.trackmatches?.track?.[0] || {}
			const songInfo: any = await getSongInfo({
				mbid: mbid,
			})

			const { album, duration } = songInfo?.track ?? {}
			return {
				artwork: album?.image?.[3]?.['#text'] || singerInfoCache?.[artist]?.images?.[0]?.url,
				artworkMini: album?.image?.[3]?.['#text'] || singerInfoCache?.[artist]?.images?.[0]?.url,
				artist: formatedMetadata.artist || artist,
				artistInfo: { images: [{ url: album?.image?.[3]?.['#text'] }] } || {},
				rating: 0,
				formatedTitle: formatedTitle,
				genre: formatedTitle,
				album: formatedMetadata.album || album,
				pendingMeta: false,
				playlist: [...(formatedMetadata.playlist || album?.title || 'unknown')],
				duration,
				// name: metadata.title ?? title,
				from: 'webdav',
			}
		}

		return {
			artistInfo: { images: [{ url: artwork }] } || {},
			rating: 0,
			formatedTitle: formatedTitle,
			from: 'webdav',
			pendingMeta: false,
			...formatedMetadata,
		}
	} catch (error) {
		if (error.message.includes('Aborted')) {
			console.log('metadata fetch was ' + error.message)
		} else {
			console.log('metadata error', error)
		}

		return {
			pendingMeta: true,
		}
	}
}
