import request from '@/helpers/request'
export async function searchSongs(
	params: any,
	configs: { api_key: any; format: string } | undefined,
) {
	return request('https://ws.audioscrobbler.com/2.0/', {
		params: {
			method: 'track.search',
			limit: '2',
			...params,
			...configs,
		},
	})
}
export async function getSongInfo(
	params: any,
	configs: { api_key: any; format: string } | undefined,
) {
	return request('https://ws.audioscrobbler.com/2.0/', {
		params: {
			method: 'track.getInfo',
			...params,
			...configs,
		},
	})
}
export async function getSingerInfo(params: any, configs: { api_key: any; format: string }) {
	return request('https://ws.audioscrobbler.com/2.0/', {
		params: {
			method: 'artist.getInfo',
			...params,
			...configs,
		},
	}) as any
}
