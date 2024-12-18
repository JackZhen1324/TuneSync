// baseMiddleware.ts
// 负责基础的本地文件metadata提取和图像处理
import { extractMetadataFromURL } from 'tunesyncmodule'
import { resizeBase64Image } from '../../imageTools'
import { MetadataMiddleware } from '../types'

export const baseMetadataMiddleware: MetadataMiddleware = async (ctx, next) => {
	const { abortSignal, params, metadata } = ctx
	const { title, webdavUrl } = params
	if (abortSignal.aborted) throw new Error('Aborted: baseMetadata')

	const rawData: any = await extractMetadataFromURL(webdavUrl)

	const { artwork: rawImage, ...meta } = rawData

	// 基础格式化
	ctx.metadata.title = title
	ctx.metadata.formatedTitle = meta.title ?? title
	ctx.metadata.artist = meta.artist
	ctx.metadata.playlist = [meta.albumName || 'Unknown']
	ctx.metadata.album = meta.albumName
	ctx.metadata.pendingMeta = false
	ctx.metadata.rating = 0

	if (rawImage) {
		const artworkRaw = `data:image/jpeg;base64,${rawImage}`
		const [compressedImage, artwork] = await resizeBase64Image(artworkRaw, 40, 40)
		ctx.metadata.artwork = artwork
		ctx.metadata.artworkMini = compressedImage
		ctx.metadata.artistInfo = {
			images: [{ url: artwork }],
		}
	}

	await next()
}
