import { MediaCenter } from '@/components/MediaCenter'
import fetchDict from '@/helpers/webdavInit'
import { defaultStyles } from '@/styles'
import { useRequest } from 'ahooks'
import { useLocalSearchParams, useRouter, useSegments } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'

const Meida = () => {
	const segments = useSegments()
	const pathname = segments.join('/').replace('[...path]', 'root')
	const { path, dir } = useLocalSearchParams()
	const [directories, setDirectories] = useState([])
	const { loading, runAsync } = useRequest(fetchDict, {
		manual: true,
	})
	const router = useRouter()
	useEffect(() => {
		const curDir = '/' + path.slice(1)?.join('/')

		runAsync(curDir).then((el) => {
			setDirectories(el)
		})

		return () => {}
	}, [])
	// console.log('dicsData', directories)
	const onDirPress = async (item) => {
		const { basename, filename, type } = item
		const nextPath = pathname + '/' + filename

		router.setParams({
			dir: filename,
			name: filename,
			// path: filename,
		})
		if (type === 'directory') {
			router.push(nextPath)
		}
	}
	return (
		<View style={defaultStyles.container}>
			{loading ? (
				<View
					style={{
						height: '80%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<ActivityIndicator color={'#fff'}></ActivityIndicator>
				</View>
			) : (
				<MediaCenter data={directories} onDirPress={onDirPress}></MediaCenter>
			)}
		</View>
	)
}

export default Meida
