import RNFS from 'react-native-fs'
import TrackPlayer from 'react-native-track-player'

const CACHE_DIR = `${RNFS.DocumentDirectoryPath}/music_cache`

// 初始化缓存目录
export const initCacheDirectory = async () => {
	const exists = await RNFS.exists(CACHE_DIR)
	if (!exists) {
		await RNFS.mkdir(CACHE_DIR)
	}
}

// 获取缓存音轨
interface Track {
	id: string
	url: string
	title: string
	artist: string
	artwork?: string
	basename?: string
}

export const getCachedTrack = async (trackUrl: string, trackId: string): Promise<string> => {
	const fileExtension = trackUrl.split('.').pop() || ''
	const fileName = `${trackId}.${fileExtension}`
	const filePath = `${CACHE_DIR}/${fileName}`

	const fileExists = await RNFS.exists(filePath)
	if (fileExists) {
		console.log('hit cache:', filePath)
		return filePath
	} else {
		try {
			const options = {
				fromUrl: trackUrl,
				toFile: filePath,
				background: true,
				discretionary: true,
			}

			const downloadResult = RNFS.downloadFile(options)
			const result = await downloadResult.promise

			if (result.statusCode === 200) {
				console.log('start playing from cache', filePath)
				return trackUrl
			} else {
				console.error('文件下载失败')
				return trackUrl
			}
		} catch (error) {
			console.log('缓存音轨时出错:', error)
			console.error('缓存音轨时出错:', error)
			return trackUrl // 返回远程 URL 作为回退
		}
	}
}

// 添加音轨到播放器
interface TrackToAdd extends Track {
	url: string
}

export const addTrackToPlayer = async (track: Track): Promise<void> => {
	const trackUrl = await getCachedTrack(track.url, track.basename || track.id)
	const trackToAdd: TrackToAdd = {
		...track,
		url: trackUrl,
	}

	await TrackPlayer.add(trackToAdd)
}

// // 应用启动时初始化缓存目录
// initCacheDirectory();

// // 示例使用
// const track = {
//   id: 'track123',
//   url: 'https://example.com/path/to/track.mp3',
//   title: '歌曲标题',
//   artist: '艺术家名称',
//   artwork: 'https://example.com/path/to/artwork.jpg',
// };

// addTrackToPlayer(track);
