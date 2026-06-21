import { createClient } from 'webdav'

export default (props: any) => {
	const { location, username, password } = props || {}

	return createClient(location, {
		username: username,
		password: password,
	})
}
