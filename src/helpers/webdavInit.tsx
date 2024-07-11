import webdavClient from './request'

async function fetchDict(input = '/') {
	try {
		// console.log('test')

		const directoryItems = await webdavClient.getDirectoryContents(input)
		// console.log('directoryItems1', directoryItems) // Handle the response XML data
		// console.log(directoryItems) // Handle the response XML data

		// console.log('directoryItems2', directoryItems) // Handle the response XML data
		return directoryItems

		// setData(directoryItems)
	} catch (error) {
		console.error(error)
		return undefined
	}
}

export default fetchDict
