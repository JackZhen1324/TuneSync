import getWebdavClient from '@/hooks/useWebdavClient'
import { WebDAVClient } from 'webdav'

export async function indexingWebdav(configs: any[], refresh: any) {
	const total: any[] = []

	try {
		await Promise.all(
			configs.map(async ({ dir, config }) => {
				try {
					const webdavClient = getWebdavClient(config)
					const musicFiles = await fetchMusicFilesFromDir(dir, webdavClient)
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

async function fetchMusicFilesFromDir(dir: string, webdavClient: WebDAVClient): Promise<any[]> {
	const totalMusicFiles: any[] = []

	try {
		const contents = await webdavClient.getDirectoryContents(dir)

		const audioFiles = await processFiles(contents, webdavClient)
		totalMusicFiles.push(...audioFiles)

		const subdirectories = contents.filter((el: { type: string }) => el.type === 'directory')
		for (const subdir of subdirectories) {
			const nestedMusicFiles = await fetchMusicFilesFromDir(subdir.filename, webdavClient)
			totalMusicFiles.push(...nestedMusicFiles)
		}
	} catch (error) {
		console.error(`Error processing directory ${dir}:`, error)
	}

	return totalMusicFiles
}

async function processFiles(files: any[], webdavClient: WebDAVClient): Promise<any[]> {
	return await Promise.all(
		files
			.filter((file: { mime: string | string[] }) => file?.mime?.includes('audio'))
			.map(async (file: { filename: string; basename: string; album?: any }) => {
				try {
					const downloadLink = webdavClient.getFileDownloadLink(file.filename)
					return {
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
