/*
 * @Author: Zhen Qian zqian15@asu.edu
 * @Date: 2025-02-12 14:59:07
 * @LastEditors: Zhen Qian zqian15@asu.edu
 * @LastEditTime: 2025-02-19 14:39:22
 * @FilePath: /TuneSync/src/helpers/LyricLoader/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// eslint-disable
import useWebdavClient from '@/hooks/useWebdavClient'
import { searchLyricViaNetease, searchSongsViaNetease } from '@/service/neteaseData'
import { useState } from 'react'
import { parseLrc } from './parser'
const parseTime = (timeString: { split: (arg0: string) => [any, any] }) => {
	const [minutes, seconds] = timeString.split(':')
	const [secs, millis] = seconds.split('.')

	return parseInt(minutes) * 60 + parseInt(secs) + parseInt(millis || 0) / 1000
}
async function getOnlineLyric(params: { s: any }) {
	const el = (await searchSongsViaNetease(params)) as any
	const id = el?.result?.songs?.[0]?.id
	const lyric = (await searchLyricViaNetease({ id })) as any

	const raw = lyric?.lrc?.lyric
	const formatedLyric = raw
		.split('\n')
		.map((l: string) => {
			const regex = /\[([0-9]{2,3}:[0-9]{2,3}\.[0-9]{2,3})\]\s*(.*)/
			const match = l.match(regex) as any
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
	const loadLrc = async (filepath: string, name: any) => {
		const audioExtensions = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma'] // 常见音频扩展名
		const regex = new RegExp(`\\.(?:${audioExtensions.join('|')})$`)
		const match = filepath.match(regex) as any
		const basePath = filepath.replace(match, '')
		const lrcPath = `${basePath}.lrc`

		try {
			const checkExist = await webdavClient.exists(lrcPath)
			if (checkExist) {
				const res = await webdavClient.getFileContents(lrcPath, { format: 'text' })
				const lrcText = res.toString()
				// 解析为 { time, line }[]
				const parsed = parseLrc(lrcText)
				setLyrics(parsed)
			} else {
				const parsed = await getOnlineLyric({ s: name })
				setLyrics(parsed)
			}
		} catch (err) {
			console.warn('获取本地 LRC 失败:', err)
			setLyrics([{ line: '暂无歌词', time: 0 }])
		}
	}

	return { lyrics, loadLrc }
}
