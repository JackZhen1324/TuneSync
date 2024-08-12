import getWebdavClient from '@/hooks/useWebdavClient'
import { WebDAVClient } from 'webdav'

export async function indexingWebdav(
	configs: any[],
	setLoading: ({
		loading,
		percentage,
	}: {
		loading: boolean
		percentage: number
		current: string
	}) => void,
	refresh: any,
	token: string,
) {
	setLoading({
		loading: true,
		percentage: 0,
		current: '',
	})
	const singerInfoCache = {}
	const percertageOfEachConfig = Math.floor(100 / (configs.length || 1))
	let currentPercentage = 0
	const total = []

	for (let i = 0; i < configs.length; i++) {
		const element = configs[i]
		const { dir, config } = element
		const webdavClient = getWebdavClient(config)
		const music = await webdavClient.getDirectoryContents(dir)
		const percentageForNestSection = percertageOfEachConfig / (music.length || 1)

		const filteredMusicPromises = music
			?.filter((el: { mime: string | string[] }) => el?.mime?.includes('audio'))
			.map(async (el: { filename: any; basename: any }) => {
				currentPercentage += percentageForNestSection
				setLoading({
					loading: true,
					percentage: currentPercentage,
					current: el.basename,
				})

				const downloadLink: string = webdavClient.getFileDownloadLink(el.filename)
				return {
					url: downloadLink,
					title: el.basename,
					playlist: el?.album?.title || [],
					from: 'webdav',
					...el,
				}
			})

		const filteredMusic = await Promise.all(filteredMusicPromises)
		total.push(...filteredMusic)

		const dirs = music?.filter((el: { type: string }) => el.type === 'directory')

		for (const dir of dirs) {
			const nestedMusic = await getNestMusic(dir, webdavClient, token, singerInfoCache, setLoading)
			currentPercentage += percentageForNestSection

			total.push(...nestedMusic)
		}
	}

	try {
		setLoading({
			loading: false,
			percentage: 100,
			current: '',
		})
		return total
	} catch (error) {
		// Error saving data
		console.error('Error saving data:', error)
		return []
	}
}

async function getNestMusic(
	dir: { filename: any },
	webdavClient: WebDAVClient,
	token: string,
	singerInfoCache: any,
	setLoading: any,
) {
	const { filename } = dir
	const dirs = await webdavClient.getDirectoryContents(filename)
	let nestedMusic: any[] = []
	const filteredDirs = (dirs || []).filter((el: { mime: string | string[] }) =>
		el?.mime?.includes('audio'),
	)
	for (const element of filteredDirs) {
		if (element.type === 'directory') {
			const deeperNestedMusic = await getNestMusic(
				element,
				webdavClient,
				token,
				singerInfoCache,
				setLoading,
			)
			nestedMusic = nestedMusic.concat(deeperNestedMusic)
		} else {
			const downloadLink: string = webdavClient.getFileDownloadLink(element.filename)
			setLoading({
				loading: true,
				percentage: 100,
				current: element.basename,
			})
			const formattedElement = {
				url: downloadLink,
				title: element.basename,
				playlist: element?.album?.title || [],
				from: 'webdav',
				...element,
			}
			nestedMusic.push(formattedElement)
		}
	}

	return nestedMusic
}
