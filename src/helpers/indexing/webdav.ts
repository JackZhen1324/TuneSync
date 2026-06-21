/*
 * @Author: Zhen Qian zqian15@asu.edu
 * @Date: 2024-12-24 15:15:35
 * @LastEditors: Zhen Qian zqian15@asu.edu
 * @LastEditTime: 2025-02-13 14:22:35
 * @FilePath: /TuneSync/src/helpers/indexing/webdav.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import getWebdavClient from '@/hooks/useWebdavClient'
import { WebDAVClient } from 'webdav'

export async function indexingWebdav(configs: any[]) {
	const total: any[] = []

	try {
		await Promise.all(
			configs.map(async ({ dir, config }) => {
				try {
					const musicFiles = await fetchMusicFilesFromDir(dir, config)
					total.push(...musicFiles)
				} catch (error) {
					console.error(`Error processing directory ${dir}:`, error)
				}
			}),
		)
	} catch (error) {
		console.error('Error indexing WebDAV:', error)
	}

	return total
}

async function fetchMusicFilesFromDir(dir: string, config: any): Promise<any[]> {
	const totalMusicFiles: any[] = []
	const webdavClient = getWebdavClient(config)
	try {
		const contents = await webdavClient.getDirectoryContents(dir)

		const audioFiles = await processFiles(contents, webdavClient, config)
		totalMusicFiles.push(...audioFiles)

		const subdirectories = contents.filter((el: { type: string }) => el.type === 'directory')
		for (const subdir of subdirectories) {
			const nestedMusicFiles = await fetchMusicFilesFromDir(subdir.filename, config)
			totalMusicFiles.push(...nestedMusicFiles)
		}
	} catch (error) {
		console.error(`Error processing directory ${dir}:`, error)
	}

	return totalMusicFiles
}

async function processFiles(files: any[], webdavClient: WebDAVClient, config: any): Promise<any[]> {
	return await Promise.all(
		files
			.filter((file: { mime: string | string[] }) => file?.mime?.includes('audio'))
			.map(async (file: { filename: string; basename: string; album?: any }) => {
				try {
					const downloadLink = webdavClient.getFileDownloadLink(file.filename)
					return {
						source: config,
						url: downloadLink,
						title: file.basename,
						playlist: file?.album?.title || [],
						from: 'webdav',
						...file,
					}
				} catch (error) {
					console.error(`Error processing file ${file.basename}:`, error)
					return null
				}
			}),
	).then((results) => results.filter(Boolean)) // Filter out null results
}
