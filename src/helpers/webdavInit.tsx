import webdavClient from './request'

async function fetchDict(input = '/') {
	try {
		const directoryItems = await webdavClient.getDirectoryContents(input)
		return directoryItems

		// setData(directoryItems)
	} catch (error) {
		console.error(error)
		return undefined
	}
}

export default fetchDict
