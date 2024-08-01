import { colors } from '@/constants/tokens'
import { menu } from '@/helpers/types'
import { useLanguageStore } from '@/store/language'
import { defaultStyles } from '@/styles'
import { AntDesign } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, TouchableHighlight, TouchableHighlightProps, View } from 'react-native'
import { languageMap } from '../locales/languageMap'

type MenuItemProps = {
	menu: menu
} & TouchableHighlightProps

export const MenuItem = ({ menu, ...props }: MenuItemProps) => {
	const { t, i18n } = useTranslation()

	const { language } = useLanguageStore((state) => state)

	return (
		<TouchableHighlight activeOpacity={0.8} {...props}>
			<View style={styles.menuItemContainer}>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						width: '100%',
					}}
				>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'flex-start',
							alignItems: 'center',
							width: '100%',
						}}
					>
						{menu.icon}
						<Text numberOfLines={1} style={styles.menuNameText}>
							{menu.title}
						</Text>
						<Text style={styles.languageContent}>
							{menu.id === 'language' && languageMap[language]}
						</Text>
					</View>
					<View>
						<AntDesign name="right" size={16} color={colors.icon} style={{ opacity: 0.5 }} />
					</View>
				</View>
			</View>
		</TouchableHighlight>
	)
}

const styles = StyleSheet.create({
	menuItemContainer: {
		flexDirection: 'row',
		columnGap: 14,
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingRight: 20,
	},
	menuArtworkImage: {
		borderRadius: 8,
		width: 70,
		height: 70,
	},
	languageContent: {
		right: 20,
		position: 'absolute',
		fontSize: 17,
		fontWeight: '600',
		color: 'white',
	},
	menuNameText: {
		...defaultStyles.text,

		paddingLeft: 16,
		fontSize: 17,
		fontWeight: '600',
		// maxWidth: '80%',
	},
})
