import AsyncStorage from '@react-native-async-storage/async-storage'
import webdavClient from './request'

export async function indexingDb(params: string) {
	const music = await webdavClient.getDirectoryContents('/music')
	const cur = await AsyncStorage.getItem('musicLibrary')
	// console.log('cur', cur)

	const filteredMusic = music
		?.filter((el: { mime: string | string[] }) => {
			return el?.mime?.includes('audio')
		})
		.map((el: { filename: any; basename: any }) => {
			const downloadLink: string = webdavClient.getFileDownloadLink(el.filename)
			return {
				url: downloadLink,
				title: el.basename,
				playlist: [],
				...el,
			}
		})
	let total = [...filteredMusic]

	const dirs = music?.filter((el: { type: string }) => {
		return el.type === 'directory'
	})

	for (const dir of dirs) {
		const nestedMusic = await getNestMusic(dir)
		total = total.concat(nestedMusic)
	}
	// console.log('cur', JSON.stringify(total))
	try {
		await AsyncStorage.setItem('musicLibrary', JSON.stringify(total))
	} catch (error) {
		// Error saving data
	}
}

async function getNestMusic(dir: { filename: any }) {
	const { filename } = dir
	const dirs = await webdavClient.getDirectoryContents(filename)
	let nestedMusic: any[] = []

	for (const element of dirs) {
		if (element.type === 'directory') {
			const deeperNestedMusic = await getNestMusic(element)
			nestedMusic = nestedMusic.concat(deeperNestedMusic)
		} else {
			const downloadLink: string = webdavClient.getFileDownloadLink(element.filename)
			const formatedElement = {
				url: downloadLink,
				title: element.basename,
				playlist: [],
				...element,
			}
			nestedMusic.push(formatedElement)
		}
	}

	return nestedMusic
}

export async function fetchLibrary() {
	const result = await AsyncStorage.getItem('musicLibrary')
	return JSON.parse(result)
}
