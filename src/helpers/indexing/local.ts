import RNFS from 'react-native-fs'
import * as mime from 'react-native-mime-types'

export const checkIsAudioFile = (path: string) => {
	const match = path.match(/\.([^.]+)$/)
	const fileExtension = match ? match[1] : ''
	const mimeType = mime.lookup(fileExtension) || ''
	return mimeType.includes('audio')
}
export async function indexingLocal(configs: any[]) {
	const singerInfoCache = {}
	const total = []
	for (let i = 0; i < configs.length; i++) {
		const element = configs[i]
		const { dir } = element
		const music = await RNFS.readDir(RNFS.DocumentDirectoryPath + '/' + dir)

		const filteredMusic = music?.filter((el) => {
			// const fileInfo = await RNFS.stat(el?.path);
			return checkIsAudioFile(el.path)
		})

		const filteredMusicPromises = filteredMusic.map(async (el) => {
			const path = el.path
			const name = el.name

			const downloadLink: string = path
			return {
				url: downloadLink,
				title: el.name,
				basename: el.name,
				from: 'local',
				...el,
			}
		})

		const formatedMusic = await Promise.all(filteredMusicPromises)
		total.push(...formatedMusic)

		const dirs = music?.filter((el) => el.isDirectory())

		for (const dir of dirs) {
			const nestedMusic = await getNestMusic(dir, RNFS, singerInfoCache)
			total.push(...nestedMusic)
		}
	}

	try {
		return total
	} catch (error) {
		// Error saving data
		console.error('Error saving data:', error)
		return []
	}
}

async function getNestMusic(dir: { path: string }, RNFS: any, singerInfoCache: any) {
	const { path } = dir
	const dirs = await RNFS.readDir(path)
	const filteredDirs = dirs
	let nestedMusic: any[] = []

	for (const element of filteredDirs) {
		if (element.type === 'directory') {
			const deeperNestedMusic = await getNestMusic(element, RNFS, singerInfoCache)
			nestedMusic = nestedMusic.concat(deeperNestedMusic)
		} else {
			const downloadLink: string = element.path
			const formattedElement = {
				url: downloadLink,
				title: element.basename,
				basename: element.name,
				playlist: element?.album?.title || [],
				...element,
				from: 'local',
			}
			nestedMusic.push(formattedElement)
		}
	}

	return nestedMusic
}
