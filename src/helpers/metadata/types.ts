import { MiddlewareEntry } from '../middlewares/const'

// types.ts
export interface Metadata {
	title?: string
	formatedTitle?: string
	artist?: string
	playlist?: string[]
	album?: string
	artwork?: string
	artworkMini?: string
	pendingMeta?: boolean
	rating?: number
	artistInfo?: {
		images?: { url: string }[]
	}
	genre?: string
	duration?: number
}

export interface FetchParams {
	title: string
	webdavUrl: string
	middlewareConfigs: MiddlewareEntry[]
}

export interface MetadataContext {
	params: FetchParams
	metadata: Partial<Metadata>
	abortSignal: AbortSignal
}

// 定义中间件类型
export type MetadataMiddleware = (ctx: MetadataContext, next: () => Promise<void>) => Promise<void>
