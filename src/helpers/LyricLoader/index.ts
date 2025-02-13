/*
 * @Author: Zhen Qian zqian15@asu.edu
 * @Date: 2025-02-12 14:59:07
 * @LastEditors: Zhen Qian zqian15@asu.edu
 * @LastEditTime: 2025-02-13 16:53:30
 * @FilePath: /TuneSync/src/helpers/LyricLoader/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import useWebdavClient from '@/hooks/useWebdavClient'
import { searchLyricViaNetease, searchSongsViaNetease } from '@/service/neteaseData'
import { useState } from 'react'
import { parseLrc } from './parser'
const parseTime = (timeString: { split: (arg0: string) => [any, any] }) => {
	const [minutes, seconds] = timeString.split(':')
	const [secs, millis] = seconds.split('.')

	return parseInt(minutes) * 60 + parseInt(secs) + parseInt(millis || 0) / 1000
}
async function getOnlineLyric(params) {
	console.log('getOnlineLyric', params)

	const el = await searchSongsViaNetease(params)
	console.log('el', el)

	const id = el?.result?.songs?.[0]?.id
	console.log('id', id)

	const lyric = await searchLyricViaNetease({ id })
	console.log('lyric', lyric)

	const raw = lyric?.lrc?.lyric
	const formatedLyric = raw
		.split('\n')
		.map((l: string) => {
			const regex = /\[([0-9]{2,3}:[0-9]{2,3}\.[0-9]{2,3})\]\s*(.*)/
			const match = l.match(regex)
			if (match) {
				const timestamp = parseTime(match[1])
				const content = match[2]
				return {
					time: timestamp,
					line: content,
				}
			}
		})
		.filter((el: any) => el)
	return formatedLyric
}
export function useLrcLoader(activeTrackObj: any = { source: {} }) {
	const { source } = activeTrackObj
	const [lyrics, setLyrics] = useState<{ time: number; line: string }[]>([])
	const webdavClient = useWebdavClient(source)
	const loadLrc = async (filepath, name) => {
		const audioExtensions = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma'] // 常见音频扩展名
		const regex = new RegExp(`\\.(?:${audioExtensions.join('|')})$`)
		const match = filepath.match(regex)
		const basePath = filepath.replace(match, '')
		const lrcPath = `${basePath}.lrc`

		try {
			const checkExist = await webdavClient.exists(lrcPath)
			console.log('checkExist', checkExist)

			if (checkExist) {
				const res = await webdavClient.getFileContents(lrcPath, { format: 'text' })
				const lrcText = res.toString()
				// 解析为 { time, line }[]
				const parsed = parseLrc(lrcText)
				setLyrics(parsed)
			} else {
				const parsed = await getOnlineLyric({ s: name })
				console.log('parsed2222', parsed)

				setLyrics(parsed)
			}
		} catch (err) {
			console.warn('获取本地 LRC 失败:', err)
			setLyrics([{ line: '暂无歌词', time: 0 }])
		}
	}

	return { lyrics, loadLrc }
}
