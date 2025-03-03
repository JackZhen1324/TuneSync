/*
 * @Author: zhen qian xhdp123@126.com
 * @Date: 2025-02-28 12:44:17
 * @LastEditors: zhen qian xhdp123@126.com
 * @LastEditTime: 2025-03-03 15:37:37
 * @FilePath: /TuneSync/src/hooks/useShouldUpdate.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { useEffect } from 'react'
import { useResumeMetadataExtraction } from './useMetadataExtration'

export const useShouldUpdate = () => {
	const { resumeMetadataExtraction } = useResumeMetadataExtraction()

	// resume task on app load
	useEffect(() => {
		resumeMetadataExtraction()
	}, [])
}
