// onion.ts

import { MetadataContext, MetadataMiddleware } from './types'

// 洋葱模型中间件执行器
export async function runMiddlewares(ctx: MetadataContext, middlewares: MetadataMiddleware[]) {
	let index = -1
	async function dispatch(i: number): Promise<void> {
		if (i <= index) throw new Error('next() called multiple times')
		index = i
		const fn = middlewares[i]
		if (fn) {
			return await fn(ctx, () => dispatch(i + 1))
		}
	}
	await dispatch(0)
}
