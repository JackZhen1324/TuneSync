import { getSongInfo, searchSongs } from '@/service/metadata'
import { searchSongsViaSpotify } from '@/service/spotifyMetadata'
import RNFS from 'react-native-fs'
import * as mime from 'react-native-mime-types'
import { getBitRate } from '../getBitRate'
import { titleFormater } from '../utils'
export const checkIsAudioFile = (path: string) => {
	const match = path.match(/\.([^.]+)$/)
	const fileExtension = match ? match[1] : ''
	const mimeType = mime.lookup(fileExtension) || ''
	return mimeType.includes('audio')
}
export async function indexingLocal(
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
			setLoading({
				loading: true,
				percentage: currentPercentage,
			})

			const downloadLink: string = path
			const metadata = await fetchMetadata({ title: name }, token, singerInfoCache)
			return {
				url: downloadLink,
				title: el.name,
				playlist: metadata?.album?.title || [],
				bitrate: getBitRate(el.size, metadata.duration),
				...el,
				...metadata,
			}
		})

		const formatedMusic = await Promise.all(filteredMusicPromises)
		total.push(...formatedMusic)

		const dirs = music?.filter((el) => el.isDirectory())

		for (const dir of dirs) {
			const nestedMusic = await getNestMusic(dir, RNFS, token, singerInfoCache)
			currentPercentage += percentageForNestSection
			setLoading({
				loading: true,
				percentage: currentPercentage,
			})
			total.push(...nestedMusic)
		}
	}

	try {
		// storage.set('musicLibrary', JSON.stringify(total))

		// refresh()
		// TrackPlayer.reset()
		setLoading({
			loading: false,
			percentage: 100,
		})
		return total
	} catch (error) {
		// Error saving data
		console.error('Error saving data:', error)
		return []
	}
}

async function getNestMusic(dir: { path: string }, RNFS: any, token: string, singerInfoCache: any) {
	const { path } = dir
	const dirs = await RNFS.readDir(path)
	const filteredDirs = dirs?.filter((el) => checkIsAudioFile(el.path))
	let nestedMusic: any[] = []

	for (const element of filteredDirs) {
		if (element.type === 'directory') {
			const deeperNestedMusic = await getNestMusic(element, RNFS, token, singerInfoCache)
			nestedMusic = nestedMusic.concat(deeperNestedMusic)
		} else {
			const downloadLink: string = element.path
			const metadata = await fetchMetadata({ title: element.name }, token, singerInfoCache)
			const formattedElement = {
				bitrate: getBitRate(element.size, metadata.duration),
				url: downloadLink,
				title: element.basename,
				playlist: element?.album?.title || [],
				...element,
				...metadata,
				from: 'local',
			}
			nestedMusic.push(formattedElement)
		}
	}

	return nestedMusic
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
			from: 'local',
			// ...res,
		}
	} catch (errir) {
		console.log('errir', errir)

		return {}
	}
}
