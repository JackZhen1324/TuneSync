/*
 * @Author: Zhen Qian zqian15@asu.edu
 * @Date: 2024-12-24 15:15:35
 * @LastEditors: Zhen Qian zqian15@asu.edu
 * @LastEditTime: 2025-02-19 16:20:49
 * @FilePath: /TuneSync/src/helpers/middlewares/const.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export type Task = {
	title: boolean
	description: boolean
	artwork: boolean
	album: boolean
	artist: boolean
	releaseDate: boolean
}
export type Target = {
	mp3: boolean
	flac: boolean
	others: boolean
}
export type MiddlewareEntry = {
	id: string
	name: string
	description: string
	// middleware: MetadataMiddleware
	key: string
	enabled: boolean
	order: number
	config?: {
		tasks: Task
		targets: Target
		apiKey?: string
	}
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
		config: {
			targets: { mp3: true, flac: false, others: true },
			tasks: {
				description: false,
				artwork: true,
				album: true,
				artist: true,
				releaseDate: true,
			},
		},
	},
	{
		id: 'fallback',
		name: 'Fallback Scraper',
		description: 'Fetch missing info (artwork, artist, etc.) from external sources.',
		key: '',
		enabled: false,
		order: 1,
		config: {
			targets: { mp3: false, flac: true, others: false },
			tasks: {
				description: false,
				artwork: false,
				album: false,
				artist: false,
				releaseDate: false,
			},
		},
	},
	// 可以在这里添加更多的插件
]
