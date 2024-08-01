import { MediaCenter } from '@/components/MediaCenterGridview'
import useWebdavClient from '@/hooks/useWebdavClient'
import { useCurrentClientStore } from '@/store/library'
import { defaultStyles } from '@/styles'
import { useRequest } from 'ahooks'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { memo, useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'

const FolderNest = memo(() => {
	const { nest: index }: { nest: string } = useLocalSearchParams()
	const path = decodeURIComponent(index)
	const [directories, setDirectories] = useState([])
	const { client } = useCurrentClientStore()
	const webdavClient = useWebdavClient(client)
	const { loading, runAsync } = useRequest(webdavClient.getDirectoryContents, {
		manual: true,
	})

	const router = useRouter()
	useEffect(() => {
		if (path) {
			runAsync(path).then((el: any) => {
				setDirectories(el)
			})
		}
	}, [path, runAsync])

	const onDirPress = useCallback((item: { filename: any; type: any }) => {
		const { filename, type, from } = item

		if (from === 'local' && from.isDirectory) {
			router.push({
				pathname: `/(tabs)/setting/media/local/${encodeURIComponent(filename)}`,
			})
		}
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

export default FolderNest
