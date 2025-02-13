/*
 * @Author: Zhen Qian zqian15@asu.edu
 * @Date: 2025-02-12 15:20:01
 * @LastEditors: Zhen Qian zqian15@asu.edu
 * @LastEditTime: 2025-02-12 15:20:06
 * @FilePath: /TuneSync/src/helpers/LyricLoader/parser.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 将 LRC 格式的字符串解析为数组
 * @param lrcContent 文件内容，如:
 *   [ti:歌名]
 *   [ar:歌手]
 *   [01:12.34] 这一句歌词
 *   [01:15.20] 下一句歌词
 */
export function parseLrc(lrcContent: string) {
	const lines = lrcContent.split(/\r?\n/)
	const result: { time: number; line: string }[] = []

	// 形如 [xx:xx.xx] 的时间标签正则
	const timeTagPattern = /\[(\d{1,2}):(\d{1,2})(?:\.(\d{1,2}))?\]/

	for (let i = 0; i < lines.length; i++) {
		const lineStr = lines[i].trim()
		if (!lineStr) continue // 跳过空行

		// 多个时间标签的情况，如 [00:10.00][00:12.00]两种
		// 例如 [00:10.00][00:12.00] 双时间标签后面是同一句歌词
		const timeTags = lineStr.match(/\[\d{1,2}:\d{1,2}(?:\.\d{1,2})?\]/g)
		const lrcText = lineStr.replace(/\[\d{1,2}:\d{1,2}(?:\.\d{1,2})?\]/g, '').trim()

		if (timeTags && timeTags.length > 0) {
			timeTags.forEach((tag) => {
				const match = tag.match(timeTagPattern)
				if (match) {
					const minutes = parseInt(match[1], 10)
					const seconds = parseInt(match[2], 10)
					const milliOrCent = match[3] ? parseInt(match[3], 10) : 0
					// 若原本是两位数毫秒(如.34)可以转为0.34秒
					const totalSeconds = minutes * 60 + seconds + milliOrCent / 100
					result.push({
						time: totalSeconds,
						line: lrcText,
					})
				}
			})
		}
	}

	// 排序：有时LRC行不是严格顺序，需要按time升序
	result.sort((a, b) => a.time - b.time)

	return result
}
