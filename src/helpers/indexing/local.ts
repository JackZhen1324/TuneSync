import RNFS from 'react-native-fs'
import * as mime from 'react-native-mime-types'

export const checkIsAudioFile = (path: string) => {
	const match = path.match(/\.([^.]+)$/)
	const fileExtension = match ? match[1] : ''
	const mimeType = mime.lookup(fileExtension) || ''
	return mimeType.includes('audio')
}
export async function indexingLocal(configs: any[], refresh: any) {
	// console.log('configs', configs)

	const singerInfoCache = {}
	const percertageOfEachConfig = Math.floor(100 / (configs.length || 1))
	let currentPercentage = 0
	const total = []

	for (let i = 0; i < configs.length; i++) {
		const element = configs[i]
		const { dir } = element
		const music = await RNFS.readDir(RNFS.DocumentDirectoryPath + '/' + dir)
		const percentageForNestSection = percertageOfEachConfig / (music.length || 1)

		const filteredMusic = music?.filter((el) => {
			// const fileInfo = await RNFS.stat(el?.path);
			return checkIsAudioFile(el.path)
		})

		const filteredMusicPromises = filteredMusic.map(async (el) => {
			const path = el.path
			const name = el.name

			currentPercentage += percentageForNestSection

			const downloadLink: string = path
			return {
				url: downloadLink,
				title: el.name,
				...el,
			}
		})

		const formatedMusic = await Promise.all(filteredMusicPromises)
		total.push(...formatedMusic)

		const dirs = music?.filter((el) => el.isDirectory())

		for (const dir of dirs) {
			const nestedMusic = await getNestMusic(dir, RNFS, singerInfoCache)
			currentPercentage += percentageForNestSection
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
				playlist: element?.album?.title || [],
				...element,
				from: 'local',
			}
			nestedMusic.push(formattedElement)
		}
	}

	return nestedMusic
}
