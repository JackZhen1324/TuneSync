// fetchMetadata.ts
// 最终的入口函数，通过配置中间件管线实现插件化。
import { baseMetadataMiddleware } from './middleware/baseMetadataMiddleware'
import { fallbackMetadataMiddleware } from './middleware/fallbackMetadataMiddleware'
import { runMiddlewares } from './onion'
import { FetchParams, MetadataContext } from './types'

export async function fetchMetadata(params: FetchParams, abortSignal: AbortSignal) {
	const ctx: MetadataContext = {
		params,
		abortSignal,
		metadata: { pendingMeta: true },
	}
	const middlewareConfig = params.middlewareConfigs

	const middlewarePipeline = middlewareConfig
		.sort((a, b) => a.order - b.order)
		.filter((el) => el.enabled)
		.map((el) => {
			switch (el.id) {
				case 'base':
					return baseMetadataMiddleware
				case 'fallback':
					return fallbackMetadataMiddleware
				default:
					return baseMetadataMiddleware
			}
		})

	try {
		await runMiddlewares(ctx, middlewarePipeline)
		return ctx.metadata
	} catch (error: any) {
		if (error.message.includes('Aborted')) {
			console.log('metadata fetch aborted:', error.message)
		} else {
			console.log('metadata error', error)
		}
		return { pendingMeta: true }
	}
}
