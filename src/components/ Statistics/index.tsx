import { colors } from '@/constants/tokens'
import { useAlbums, useArtists, useTracks } from '@/store/library'
import { useTaskStore } from '@/store/task'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, Text, View } from 'react-native'
export default function MusicScraperDarkScreen() {
	const { running } = useTaskStore()
	const scrapingTasks = running ? [running] : []

	// 示例中的本地状态，可替换成真实数据
	const { tracks } = useTracks()
	const artists = useArtists(tracks)
	const { albums } = useAlbums(tracks)
	const totalMusic = tracks.length
	const totalAlbums = albums.length
	const totalArtists = artists.length
	const { t } = useTranslation()
	// 任务列表项
	const renderTaskItem = ({ item }) => (
		<View style={styles.taskItem}>
			<Text style={styles.taskName}>{item.name}</Text>
			<Text style={styles.taskStatus}>
				状态: {item.status}{' '}
				{item.status !== 'starting' && (
					<Text>
						{'| 剩余任务: '} {item.progress}
					</Text>
				)}
			</Text>
		</View>
	)

	// 日志列表项
	const renderLogItem = ({ item }) => {
		const { type, body } = item

		let borderColor = ''
		switch (type) {
			case 'normal':
				borderColor = 'white'
				break
			case 'error':
				borderColor = 'red'
				break
			case 'warning':
				borderColor = 'yellow'
				break
			case 'success':
				borderColor = '#4CAF50'
				break
		}
		return (
			<View style={[styles.logItem, { borderLeftColor: borderColor }]}>
				<Text style={styles.logContent}>{body}</Text>
			</View>
		)
	}

	// 单个统计卡片
	const StatBox = ({ label, value }) => (
		<View style={styles.statBox}>
			<Text style={styles.statLabel}>{label}</Text>
			<Text style={styles.statValue}>{value}</Text>
		</View>
	)

	return (
		<View style={styles.container}>
			{/* 统计信息区域 */}
			<View style={styles.summaryContainer}>
				<View style={styles.statsGrid}>
					<StatBox label={t('statistics.songs')} value={totalMusic} />

					<StatBox label={t('statistics.albums')} value={totalAlbums} />
					<StatBox label={t('statistics.artists')} value={totalArtists} />
				</View>
			</View>

			{/* 当前刮削任务 */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>{t('statistics.currentTask')}</Text>
				{scrapingTasks.length === 0 ? (
					<Text style={styles.noDataText}>{t('statistics.noRunningTask')}</Text>
				) : (
					<FlatList
						data={scrapingTasks}
						// keyExtractor={(item) => item.id}
						renderItem={renderTaskItem}
					/>
				)}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	// 背景：暗黑色
	container: {
		flex: 1,
		backgroundColor: '#121212',
		padding: 16,
	},
	// 统计信息父容器
	summaryContainer: {
		backgroundColor: '#1E1E1E',
		padding: 12,
		borderRadius: 8,
		marginBottom: 16,

		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.35,
		shadowRadius: 3,
		elevation: 3,
	},
	// 网格布局，分配多个统计卡片
	statsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	// 单个统计卡片
	statBox: {
		backgroundColor: '#2A2A2A',
		borderRadius: 8,
		paddingVertical: 12,
		paddingHorizontal: 16,
		marginBottom: 8,
		width: '48%', // 两列并排

		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 2,
		elevation: 2,
	},
	statLabel: {
		fontSize: 13,
		color: '#BBBBBB',
		marginBottom: 4,
	},
	statValue: {
		fontSize: 16,
		fontWeight: 'bold',
		color: colors.primary,
	},

	// 自定义刮削按钮
	scrapeButton: {
		alignSelf: 'center',
		backgroundColor: colors.primary,
		paddingVertical: 12,
		paddingHorizontal: 40,
		borderRadius: 24,
		marginBottom: 16,

		// 阴影
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 3,
		elevation: 2,
	},
	scrapeButtonDisabled: {
		backgroundColor: '#888888',
	},
	scrapeButtonText: {
		color: '#FFF',
		fontWeight: '600',
		fontSize: 15,
	},
	logSection: {
		backgroundColor: '#1E1E1E',
		padding: 12,
		borderRadius: 8,
		marginBottom: 100,
		flex: 1,

		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 3,
		elevation: 2,
	},
	// 各分区容器
	section: {
		backgroundColor: '#1E1E1E',
		padding: 12,
		borderRadius: 8,
		marginBottom: 12,

		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 3,
		elevation: 2,
	},
	sectionOperation: {
		alignContent: 'flex-end',
		// flex: 1,
	},
	sectionHeader: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	sectionTitle: {
		// flex: 1,
		fontSize: 16,
		fontWeight: '600',
		color: '#FFFFFF',
		marginBottom: 8,
	},
	noDataText: {
		fontSize: 14,
		color: '#BBBBBB',
		marginVertical: 8,
	},

	// 任务项
	taskItem: {
		backgroundColor: '#2A2A2A',
		marginBottom: 8,
		padding: 10,
		borderRadius: 6,

		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 1,
	},
	taskName: {
		fontSize: 15,
		fontWeight: '500',
		color: '#FFFFFF',
	},
	taskStatus: {
		marginTop: 4,
		fontSize: 14,
		color: '#BBBBBB',
	},

	// 日志项
	logItem: {
		borderLeftWidth: 3,
		borderLeftColor: '#4CAF50',
		paddingLeft: 8,
		marginVertical: 4,
	},
	logContent: {
		fontSize: 14,
		lineHeight: 20,
		color: '#DDDDDD',
	},
})
