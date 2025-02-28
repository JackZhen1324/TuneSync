/*
 * @Author: Zhen Qian zqian15@asu.edu
 * @Date: 2025-02-19 15:13:13
 * @LastEditors: Zhen Qian zqian15@asu.edu
 * @LastEditTime: 2025-02-19 15:14:26
 * @FilePath: /TuneSync/src/helpers/metadata/utils.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const getSupportList = (config) => {
	const { targets } = config
	const supportList = []
	if (targets.mp3) {
		supportList.push('mp3')
	}
	if (targets.flac) {
		supportList.push('flac')
	}
	if (targets.others) {
		supportList.push('others')
	}
	return supportList
}
