import { createClient } from 'webdav'

// Create an Axios instance
const webdavClient = createClient('https://zqian24.synology.me:5006', {
	username: 'admin',
	password: 'Qianzhen123',
})

export default webdavClient
