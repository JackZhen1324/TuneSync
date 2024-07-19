import request from '@/helpers/request'
export async function searchSongsViaNetease(params: any) {
	return request('https://music.163.com/api/search/pc', {
		params: {
			type: 1,
			...params,
		},
	})
}
export async function searchLyricViaNetease(params: { id: any }) {
	return request(
		`https://music.163.com/api/song/lyric?os=pc&id={${params.id}}&lv=-1&kv=-1&tv=-1`,
		{},
	)
}
