import request from '@/helpers/request'
export async function searchSongsViaNetease(params: any) {
	return request('https://music.163.com/api/search/pc', {
		params: {
			type: 1,
			limit: 2,
			...params,
		},
		headers: {
			'User-Agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
		},
	})
}
export async function searchLyricViaNetease(params: { id: any }) {
	return request(`https://music.163.com/api/song/lyric?os=pc&id=${params.id}&lv=-1&kv=-1&tv=-1`, {
		headers: {
			'User-Agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
		},
	})
}
