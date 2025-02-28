import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Animated, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import TrackPlayer, { useProgress } from 'react-native-track-player'
import { PlayerControls } from '../PlayerControls'
import { PlayerProgressBar } from '../PlayerProgressbar'

/** 单句歌词 */
type LyricLine = {
	time: number
	line: string
}

/** 组件 Props */
type LyricsDisplayProps = {
	lyrics: LyricLine[]
	hideControler?: boolean
	refreshRate?: number
	fontSize?: number
}

/**
 * 找到当前行索引
 * （如果没找到，返回 -1）
 */
function findCurrentLineIndex(lyrics: LyricLine[], position: number) {
	return lyrics.findIndex(
		(lyric, i) => lyric.time <= position && position < (lyrics[i + 1]?.time ?? lyric.time + 99999),
	)
}

/**
 * 对某行计算进度(0~1)：当前时间在 [startTime, nextStartTime] 区间的归一化
 */
function getLineProgress(lyrics: LyricLine[], index: number, currentTime: number): number {
	if (index < 0 || index >= lyrics.length) return 0
	const start = lyrics[index].time
	const end = lyrics[index + 1]?.time ?? start + 5
	if (currentTime <= start) return 0
	if (currentTime >= end) return 1
	return (currentTime - start) / (end - start)
}

/**
 * 一个简易的 Easing 函数，让进度曲线更平滑
 * 这里用二次缓动 (easeInOutQuad) 举例
 */
function easeInOutQuad(t: number) {
	return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

/**
 * 最简单的颜色插值：灰 -> 白
 * 如果想扩展可以用其他颜色或使用三方库做更复杂插值
 */
function interpolateGrayToWhite(progress: number) {
	const clamp = (val: number) => Math.min(Math.max(val, 0), 1)
	const p = clamp(progress)

	// 灰 (128,128,128) -> 白 (255,255,255)
	const start = 128
	const end = 255
	const c = start + (end - start) * p
	const colorVal = Math.round(c)
	return `rgb(${colorVal},${colorVal},${colorVal})`
}

/**
 * 按字符拆分，对每个字符做局部“丝滑”上色的 Text 行
 * 并且只有“当前行”才会根据进度来着色；其他行恢复灰色
 */
const CharColoredLine: React.FC<{
	fontSize: number
	isFinished: boolean
	transY: Animated.Value
	lyric: LyricLine
	lineProgress: number // 0~1
	isActiveLine: boolean
	onPress: () => void
}> = ({ fontSize, isFinished, transY, lyric, lineProgress, isActiveLine, onPress }) => {
	// 将一句拆分为字符数组
	const chars = lyric.line.split('')
	const totalChars = chars.length
	const animatedStyle = {
		transform: [
			{
				translateY: isFinished || !transY ? 0 : transY,
			},
		],
	}

	return (
		<TouchableOpacity style={{ ...styles.lineItem }} onPress={onPress} activeOpacity={0.8}>
			<Animated.View style={[animatedStyle]}>
				<Text
					style={[
						styles.baseLineText,
						isActiveLine ? styles.activeLineText : styles.inactiveLineText,
						{
							fontSize: fontSize,
						},
					]}
				>
					{chars.map((char, i) => {
						// 如果不是当前行，progress=0 => 不高亮；如果是当前行，计算真实进度
						if (!isActiveLine) {
							return (
								<Text key={`char-${i}`} style={{ color: '#888' }}>
									{char}
								</Text>
							)
						}

						// 计算出该字符的“局部进度”
						// 例如 lineProgress=0.3, total=10 => 0.3*10=3 => 第 0~2 字基本全白，第 3~4 在过渡
						const floatIndex = lineProgress * totalChars
						const distance = floatIndex - i

						// 做一个 clamp + ease 让颜色变更更平滑
						const localProgress = easeInOutQuad(Math.min(Math.max(distance, 0), 1))
						const color = interpolateGrayToWhite(localProgress)

						return (
							<Text key={`char-${i}`} style={{ color }}>
								{char}
							</Text>
						)
					})}
				</Text>
			</Animated.View>
		</TouchableOpacity>
	)
}

const LyricsDisplay: React.FC<LyricsDisplayProps> = ({
	lyrics,
	refreshRate,
	fontSize,
	hideControler,
}) => {
	const flatListRef = useRef<FlatList<LyricLine>>(null)
	const [currentIndex, setCurrentIndex] = useState(0)
	const [isManualScroll, setIsManualScroll] = useState(false)
	const [isManualSeek, setIsManualSeek] = useState(false)
	const manualScrollTimeout = useRef<NodeJS.Timeout | null>(null)
	const timeRef = useRef<NodeJS.Timeout | null>(null)
	const transYs = useRef(lyrics.map(() => new Animated.Value(0)))

	// 使用 useProgress 获取更频繁的播放时间更新（这里每16.67ms更新一次）
	const { position } = useProgress(refreshRate ?? 16.67)
	useEffect(() => {
		return () => {
			// 清理定时器
			if (timeRef.current) {
				clearTimeout(timeRef.current)
				timeRef.current = null
			}
		}
	}, [])
	/**
	 * 如果没有在手动滚动，则根据播放进度自动滚动到当前行
	 */
	useEffect(() => {
		if (!isManualScroll) {
			const idx = findCurrentLineIndex(lyrics, position)
			if (idx !== -1 && idx !== currentIndex) {
				lyrics.forEach((el, index) => {
					if (transYs.current[index]) {
						Animated.timing(transYs.current[index], {
							toValue: (index - currentIndex) * 6,
							duration: 200,
							useNativeDriver: true,
						}).start(() => {
							Animated.spring(transYs.current[index], {
								toValue: 0,
								bounciness: 10,
								useNativeDriver: true,
							}).start()
						})
					}
				})
				if (!isManualSeek) {
					setCurrentIndex(idx)
					scrollToIndex(idx)
				}
				// 这里将定时器的 ID 存储在 useRef 中
				timeRef.current = setTimeout(() => {
					setIsManualSeek(false)
				}, 500)
			}
		}
	}, [position, isManualScroll, isManualSeek, currentIndex, lyrics])

	/**
	 * 滚动到指定行——让当前行置顶
	 */
	const scrollToIndex = useCallback(
		(index: number) => {
			if (flatListRef.current) {
				flatListRef.current.scrollToIndex({
					index,
					animated: true,
					viewPosition: 0,
				})
			}
		},
		[lyrics],
	)

	// 用户手动滚动时，暂停自动滚动
	const handleScrollBeginDrag = () => {
		setIsManualScroll(true)
		if (manualScrollTimeout.current) {
			clearTimeout(manualScrollTimeout.current)
		}
	}

	// 停止滚动后，2s 后恢复自动滚动
	const handleScrollEndDrag = () => {
		manualScrollTimeout.current = setTimeout(() => {
			setIsManualScroll(false)
		}, 2000)
	}

	// 点击某行 => 跳转到该时间
	const handlePressLine = (time: number, index: number) => {
		setIsManualSeek(true)
		TrackPlayer.seekTo(time)
		setCurrentIndex(index)
		scrollToIndex(index)
	}

	// 渲染列表每行
	const renderItem = ({ item, index }: { item: LyricLine; index: number }) => {
		// 如果不是当前行，progress=0；如果是当前行，计算真实进度
		const isActiveLine = index === currentIndex
		const lineProgress = isActiveLine ? getLineProgress(lyrics, index, position) : 0
		const isFinished = index <= currentIndex

		return (
			<CharColoredLine
				fontSize={fontSize ?? 20}
				isFinished={isFinished}
				transY={transYs.current[index]}
				lyric={item}
				lineProgress={lineProgress}
				isActiveLine={isActiveLine}
				onPress={() => handlePressLine(item.time, index)}
			/>
		)
	}

	// 优化布局
	const getItemLayout = (data: { length: number } | null | undefined, index: number) => ({
		length: ITEM_HEIGHT,
		offset: ITEM_HEIGHT * index,
		index,
	})

	if (!lyrics || lyrics.length === 0) {
		return (
			<View style={styles.noLyricsContainer}>
				<Text style={{ color: '#fff' }}>暂无歌词</Text>
			</View>
		)
	}

	return (
		<>
			<View style={styles.container}>
				<FlatList
					onScroll={() => {}}
					ref={flatListRef}
					data={lyrics}
					keyExtractor={(_, i) => String(i)}
					renderItem={renderItem}
					getItemLayout={getItemLayout}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingTop: 0, paddingVertical: 80, paddingBottom: 450 }}
					onScrollBeginDrag={handleScrollBeginDrag}
					onScrollEndDrag={handleScrollEndDrag}
				/>
			</View>
			{/* 这里可放进度条/播放控制等 */}
			{!hideControler && (
				<View style={styles.controlerContainer}>
					<View style={{ marginTop: 'auto' }}>
						<PlayerProgressBar style={{ marginTop: 32 }} />
						<PlayerControls style={{ marginTop: 40 }} />
					</View>
				</View>
			)}
		</>
	)
}

// 视觉样式
const ITEM_HEIGHT = 80

const styles = StyleSheet.create({
	controlerContainer: {
		height: 126,
		width: '100%',
	},
	container: {
		flex: 1,
	},
	noLyricsContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	lineItem: {
		height: ITEM_HEIGHT,
		justifyContent: 'center',
		alignItems: 'center',
	},
	baseLineText: {
		fontSize: 20,
		textAlign: 'center',
	},
	// 当前行可做更突出的样式
	activeLineText: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	// 非当前行可做更暗的样式
	inactiveLineText: {
		color: '#666',
		fontWeight: 'bold',
	},
})

export default LyricsDisplay
