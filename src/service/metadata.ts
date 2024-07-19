import request from '@/helpers/request'
export async function searchSongs(params: any) {
	return request('https://ws.audioscrobbler.com/2.0/', {
		params: {
			method: 'track.search',
			limit: '2',
			...params,
		},
	})
}
export async function getSongInfo(params: any) {
	return request('https://ws.audioscrobbler.com/2.0/', {
		params: {
			method: 'track.getInfo',
			...params,
		},
	})
}
export async function getSingerInfo(params: any) {
	return request('https://ws.audioscrobbler.com/2.0/', {
		params: {
			method: 'artist.getInfo',
			...params,
		},
	}) as any
}
