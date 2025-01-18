/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { useCallback, useMemo, useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'

import { useAlbums, useLibraryStore, usePlaylists } from '@/store/library'
import CoverFlow from '../CoverFlow'
import Image from '../Image'

/* eslint-disable global-require */

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'black',
	},
	item: {
		width: 64 * 2.5,
		height: 64 * 2.5,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'blue',
		borderWidth: 2,
		borderColor: '#fff',
		borderRadius: 10,
	},
})

// export default class CoverFlowDemo2 extends Component {
// 	constructor(props) {
// 		super(props)

// 		const values = {
// 			spacing: 180,
// 			wingSpan: 80,
// 			rotation: 70,
// 			midRotation: 0,
// 			scaleDown: 0.8,
// 			scaleFurther: 0.75,
// 			perspective: 800,
// 			cards: 20,
// 		}

// 		this.state = values
// 	}

// 	onChange = (item) => {
// 		console.log(`'Current Item', ${item}`)
// 	}

// 	onPress = (item) => {
// 		Alert.alert(`Pressed on current item ${item}`)
// 	}

// 	getCards(count) {
// 		const res = []
// 		const keys = Object.keys(CARDS)
// 		for (let i = 0; i < count && i < keys.length; i += 1) {
// 			const card = keys[i]
// 			console.log('Rendering Card', card)
// 			res.push(
// 				<Image
// 					key={card}
// 					source={CARDS[card]}
// 					resizeMode="contain"
// 					style={{
// 						width: 400,
// 						alignItems: 'center',
// 						justifyContent: 'center',
// 						height: '90%',
// 						// borderRadius: 20,
// 					}}
// 				/>,
// 			)
// 		}
// 		return res
// 	}

// 	render() {
// 		const {
// 			spacing,
// 			wingSpan,
// 			rotation,
// 			perspective,
// 			scaleDown,
// 			scaleFurther,
// 			midRotation,
// 			cards,
// 		} = this.state

// 		return (
// 			<View style={{ flex: 1 }}>
// 				<CoverFlow
// 					style={styles.container}
// 					onChange={this.onChange}
// 					onPress={this.onPress}
// 					spacing={spacing}
// 					wingSpan={wingSpan}
// 					rotation={rotation}
// 					midRotation={midRotation}
// 					scaleDown={scaleDown}
// 					scaleFurther={scaleFurther}
// 					perspective={perspective}
// 					initialSelection={10}
// 				>
// 					{this.getCards(cards)}
// 				</CoverFlow>

// 			</View>
// 		)
// 	}
// }

const CoverFlowDemo = () => {
	const { setTracks, tracks, tracksMap, batchUpdate } = useLibraryStore((state: any) => state)
	// console.log('tracks', tracks)
	const { albums } = useAlbums(tracks)
	const { playlist } = usePlaylists()
	const [spacing, setSpacing] = useState(180)
	const [wingSpan, setWingSpan] = useState(40)
	const [rotation, setRotation] = useState(75)
	const [perspective, setPerspective] = useState(800)
	const [scaleDown, setScaleDown] = useState(0.7)
	const [scaleFurther, setScaleFurther] = useState(0.65)
	const [midRotation, setMidRotation] = useState(0)
	const [cards, setCards] = useState(20)
	const collections = useMemo(() => {
		return [...albums, ...playlist]
	}, [albums, playlist])

	// 处理卡片变更
	const onChange = useCallback((item) => {
		console.log(`'Current Item', ${item}`)
	}, [])

	// 处理卡片点击
	const onPress = useCallback((item) => {
		Alert.alert(`Pressed on current item ${item}`)
	}, [])

	const getCards = (tracks, collection) => {
		const res = []
		// const keys = Object.keys(tracksMap)
		// console.log('collections', collection)
		const a = [{}]
		console.log('collection', collection, collection.length)

		collection.forEach((element) => {
			console.log('element.artwork', element.artworkPreview, element.name)

			res.push(
				<Image
					key={element.name}
					source={element.artworkPreview}
					resizeMode="contain"
					style={{
						width: 300,
						alignItems: 'center',
						justifyContent: 'center',
						height: '80%',
						// borderRadius: 20,
					}}
				/>,
			)
		})
		console.log('res', res)

		return res
	}
	return (
		<View style={{ flex: 1 }}>
			<CoverFlow
				style={styles.container}
				onChange={onChange}
				onPress={onPress}
				spacing={spacing}
				wingSpan={wingSpan}
				rotation={rotation}
				midRotation={midRotation}
				scaleDown={scaleDown}
				scaleFurther={scaleFurther}
				perspective={perspective}
				initialSelection={Math.round(collections.length / 2)}
			>
				{getCards(tracks, collections)}
			</CoverFlow>
		</View>
	)
}
export default CoverFlowDemo
// AppRegistry.registerComponent('CoverFlow', () => CoverFlowDemo)
