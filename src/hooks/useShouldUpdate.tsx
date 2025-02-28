/*
 * @Author: zhen qian xhdp123@126.com
 * @Date: 2025-02-28 12:44:17
 * @LastEditors: zhen qian xhdp123@126.com
 * @LastEditTime: 2025-02-28 15:19:16
 * @FilePath: /TuneSync/src/hooks/useShouldUpdate.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { useIndexStore } from '@/store/library'
import { useTaskStore } from '@/store/task'
import { useEffect } from 'react'
import { useResumeMetadataExtraction } from './useMetadataExtration'
import { useRefreshLibrary } from './useRefreshLibrary'

export const useShouldUpdate = () => {
	const { resumeMetadataExtraction } = useResumeMetadataExtraction()
	const { refreshLibraryWithCache } = useRefreshLibrary()

	const { running } = useTaskStore()
	useEffect(() => {
		if (running?.name === 'scraping') {
			resumeMetadataExtraction()
		}
	}, [running?.name])
	useEffect(() => {
		// 监听 count 变化
		const unsubscribe = useIndexStore.subscribe(
			(state) => state.indexingList.length,
			() => {
				refreshLibraryWithCache()
			},
		)

		return () => unsubscribe() // 组件卸载时取消订阅
	}, [])
}
