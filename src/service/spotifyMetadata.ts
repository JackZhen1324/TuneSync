import request from '@/helpers/request'
export async function searchSongsViaSpotify(params, config) {
	return request('https://api.spotify.com/v1/search', {
		params,
		...config,
	})
}
