/*
 * @Author: Zhen Qian zqian15@asu.edu
 * @Date: 2024-12-24 15:15:35
 * @LastEditors: Zhen Qian zqian15@asu.edu
 * @LastEditTime: 2025-02-20 02:58:57
 * @FilePath: /TuneSync/src/helpers/metadata/middleware/baseMetadataMiddleware.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// baseMiddleware.ts
// 负责基础的本地文件metadata提取和图像处理
import { extractMetadataFromURL } from 'tunesyncmodule'
import { resizeBase64Image } from '../../imageTools'
import { MetadataMiddleware } from '../types'
import { getSupportList } from '../utils'

export const baseMetadataMiddleware: MetadataMiddleware = async (ctx, next) => {
	const { params, metadata } = ctx
	const { title, webdavUrl } = params
	const config = params.middlewareConfigs.find((el) => el.id === 'base')
	const supportedList = getSupportList(config?.config)
	const isSupport = supportedList.find((el) => title.includes(el))
	if (isSupport) {
		const rawData: any = await extractMetadataFromURL(webdavUrl)
		const tasks = config?.config?.tasks
		const { artwork: rawImage, ...meta } = rawData

		// 基础格式化
		ctx.metadata.title = title
		ctx.metadata.formatedTitle = meta.title ?? title
		if (tasks?.artist) {
			ctx.metadata.artist = meta.artist
		}
		if (tasks?.album) {
			ctx.metadata.playlist = [meta.albumName || 'Unknown']
			ctx.metadata.album = meta.albumName
		}

		ctx.metadata.pendingMeta = false
		ctx.metadata.rating = 0

		if (rawImage && tasks?.artwork) {
			const artworkRaw = `data:image/jpeg;base64,${rawImage}`
			const [compressedImage, artwork] = await resizeBase64Image(artworkRaw, 40, 40)
			ctx.metadata.artwork = artwork
			ctx.metadata.artworkMini = compressedImage
			ctx.metadata.artistInfo = {
				images: [{ url: artwork }],
			}
		}
	}
	await next()
}
