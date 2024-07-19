import request from '@/helpers/request'
export async function getAccessToken() {
	const params = new URLSearchParams()
	params.append('grant_type', 'client_credentials')
	params.append('client_id', 'f690106c3dcd4e2aba404bb13b4e61da')
	params.append('client_secret', 'c261a3884f894aafa1fa8100f3b24249')
	return request('https://accounts.spotify.com/api/token', {
		method: 'POST',
		data: params,
	})
}
