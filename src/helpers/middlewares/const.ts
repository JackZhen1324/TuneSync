export interface MiddlewareEntry {
	id: string
	name: string
	description: string
	// middleware: MetadataMiddleware
	key: string
	enabled: boolean
	order: number
}

// 初始的中间件注册信息
export const middlewareRegistry: MiddlewareEntry[] = [
	{
		id: 'base',
		name: 'Base Scraper',
		description: 'Extract metadata from local file',
		key: '',
		enabled: true,
		order: 0,
	},
	{
		id: 'fallback',
		name: 'Fallback Scraper',
		description: 'Fetch missing info (artwork, artist, etc.) from external sources.',
		key: '',
		enabled: false,
		order: 1,
	},
	// 可以在这里添加更多的插件
]
