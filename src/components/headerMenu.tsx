import { MenuView } from '@react-native-menu/menu'
import { PropsWithChildren } from 'react'
import { match } from 'ts-pattern'

type TrackShortcutsMenuProps = PropsWithChildren<{ refreshLibrary: any }>

export const HeaderMemu = ({ refreshLibrary, children }: TrackShortcutsMenuProps) => {
	const handlePressAction = (id: string) => {
		match(id)
			.with('refresh-library', async () => {
				await refreshLibrary()
			})
			.with('remove-from-favorites', async () => {})
			.otherwise(() => console.warn(`Unknown menu action ${id}`))
	}

	return (
		<MenuView
			onPressAction={({ nativeEvent: { event } }) => handlePressAction(event)}
			actions={[
				// {
				// 	id: 'refresh-metadata',
				// 	title: 'Refresh metadata',
				// 	image: 'load',
				// },
				{
					id: 'refresh-library',
					title: 'Refresh library',
					image: 'reload',
				},
			]}
		>
			{children}
		</MenuView>
	)
}
