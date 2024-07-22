import getWebdavClient from '@/hooks/useWebdavClient'
import { getSongInfo, searchSongs } from '@/service/metadata'
import { searchSongsViaSpotify } from '@/service/spotifyMetadata'
import AsyncStorage from '@react-native-async-storage/async-storage'
import TrackPlayer from 'react-native-track-player'
import { WebDAVClient } from 'webdav'
import { getBitRate } from './getBitRate'
import { titleFormater } from './utils'

export async function indexingDb(
	configs: any[],
	setLoading: ({ loading, percentage }: { loading: boolean; percentage: number }) => void,
	refresh: any,
	token: string,
) {
	setLoading({
		loading: true,
		percentage: 0,
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
				})

				const downloadLink: string = webdavClient.getFileDownloadLink(el.filename)
				const metadata = await fetchMetadata({ title: el.basename }, token, singerInfoCache)
				return {
					url: downloadLink,
					title: el.basename,
					playlist: el?.album?.title || [],
					bitrate: getBitRate(el.size, metadata.duration),
					...el,
					...metadata,
				}
			})

		const filteredMusic = await Promise.all(filteredMusicPromises)
		total.push(...filteredMusic)

		const dirs = music?.filter((el: { type: string }) => el.type === 'directory')

		for (const dir of dirs) {
			const nestedMusic = await getNestMusic(dir, webdavClient, token, singerInfoCache)
			currentPercentage += percentageForNestSection
			setLoading({
				loading: true,
				percentage: currentPercentage,
			})
			total.push(...nestedMusic)
		}
	}

	try {
		await AsyncStorage.setItem('musicLibrary', JSON.stringify(total))
		refresh()
		TrackPlayer.reset()
		setLoading({
			loading: false,
			percentage: 100,
		})
	} catch (error) {
		// Error saving data
		console.error('Error saving data:', error)
	}
}

async function getNestMusic(
	dir: { filename: any },
	webdavClient: WebDAVClient,
	token: string,
	singerInfoCache: any,
) {
	const { filename } = dir
	const dirs = await webdavClient.getDirectoryContents(filename)
	const filteredDirs = dirs?.filter((el: { mime: string | string[] }) =>
		el?.mime?.includes('audio'),
	)
	let nestedMusic: any[] = []

	for (const element of filteredDirs) {
		if (element.type === 'directory') {
			const deeperNestedMusic = await getNestMusic(element, webdavClient, token, singerInfoCache)
			nestedMusic = nestedMusic.concat(deeperNestedMusic)
		} else {
			const downloadLink: string = webdavClient.getFileDownloadLink(element.filename)
			const metadata = await fetchMetadata({ title: element.basename }, token, singerInfoCache)
			const formattedElement = {
				bitrate: getBitRate(element.size, metadata.duration),
				url: downloadLink,
				title: element.basename,
				playlist: element?.album?.title || [],
				...element,
				...metadata,
			}
			nestedMusic.push(formattedElement)
		}
	}

	return nestedMusic
}

export async function fetchLibrary() {
	const result = await AsyncStorage.getItem('musicLibrary')
	return JSON.parse(result)
}

export async function fetchMetadata(params: { title: any }, token: string, singerInfoCache: any) {
	try {
		const { title } = params
		const formatedTitle = titleFormater(title)

		const { results }: any = await searchSongs({
			track: formatedTitle,
		})
		const matchedTrack = results?.trackmatches?.track?.filter((el) => el.mbid)
		const { mbid, image, artist } = matchedTrack?.[0] || results?.trackmatches?.track?.[0] || {}
		const songInfo: any = await getSongInfo({
			mbid: mbid,
		})
		const { url, album, artist: artistObj, duration, ...res } = songInfo?.track ?? {}
		if (!singerInfoCache?.[artist] && artist) {
			const { artists } = await searchSongsViaSpotify(
				{ q: artist, type: 'artist' },
				{
					headers: {
						Authorization: token,
						'Content-Type': 'application/json',
					},
				},
			)
			singerInfoCache[artist] = artists?.items?.[0]
		}

		return {
			artwork: album?.image?.[3]?.['#text'] || singerInfoCache?.[artist]?.images?.[0]?.url,
			artist,
			artistInfo: singerInfoCache?.[artist] || {},
			rating: 0,
			formatedTitle: formatedTitle,
			genre: formatedTitle,
			album: album,
			playlist: [album?.title || 'unknown'],
			duration,
			// ...res,
		}
	} catch (errir) {
		return {}
	}
}
