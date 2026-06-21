import { MediaCenter } from '@/components/MediaCenter'
import useWebdavClient from '@/hooks/useWebdavClient'
import { useCurrentClientStore } from '@/store/library'
import { defaultStyles } from '@/styles'
import { useRequest } from 'ahooks'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { memo, useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'

const Media = memo(() => {
	const { index }: { index: string } = useLocalSearchParams()
	const path = decodeURIComponent(index)
	const [directories, setDirectories] = useState([])
	const { client } = useCurrentClientStore()
	const webdavClient = useWebdavClient(client)
	const { loading, runAsync } = useRequest(webdavClient.getDirectoryContents, {
		manual: true,
	})
	const router = useRouter()
	useEffect(() => {
		runAsync(path).then((el: any) => {
			setDirectories(
				el.map((item: any) => {
					return {
						...item,
						from: 'webdav',
					}
				}),
			)
		})
	}, [path, runAsync])

	const onDirPress = useCallback((item: { filename: any; type: any }) => {
		const { filename, type } = item

		if (type === 'directory') {
			router.push({
				pathname: `/(tabs)/setting/media/webdav/${encodeURIComponent(filename)}`,
			})
		}
	}, [])

	return (
		<View key={path} style={defaultStyles.container}>
			{loading ? (
				<View
					style={{
						height: '80%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<ActivityIndicator color={'#fff'} />
				</View>
			) : (
				<MediaCenter key={path} data={directories} onDirPress={onDirPress} />
			)}
		</View>
	)
})

export default Media
