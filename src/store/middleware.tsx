import { MiddlewareEntry, middlewareRegistry } from '@/helpers/middlewares/const'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { storage } from './mkkv'
interface MiddlewareStore {
	middlewareConfigs: MiddlewareEntry[]
	setConfig: (data: MiddlewareEntry[]) => void
}
/**
 * A custom hook that creates a middleware store using Zustand and persists its state.
 *
 * @returns {Object} The middleware store with the following properties:
 * - `middlewareConfigs`: The current middleware configurations from the middleware registry.
 * - `setConfig(data: any[])`: A function to update the middleware configurations with the provided data.
 *
 * @example
 * const { middlewareConfigs, setConfig } = useMiddlewareStore();
 *
 * // To update the middleware configurations
 * setConfig(newMiddlewareConfigs);
 *
 * @remarks
 * The state is persisted in AsyncStorage under the key 'middlewareInfo'.
 * The storage methods are defined to handle JSON serialization and deserialization.
 */

export const useMiddlewareStore = create<MiddlewareStore>()(
	persist(
		(set) => ({
			middlewareConfigs: middlewareRegistry,
			setConfig: (data) => {
				set(() => {
					return {
						middlewareConfigs: data,
					}
				})
			},
		}),
		{
			name: 'middlewareInfo', // 存储在 AsyncStorage 中的键名
			storage: {
				getItem: (name: string) => {
					const value = storage.getString(name)
					return value ? JSON.parse(value) : null
				},
				setItem: (name: string, value: any) => storage.set(name, JSON.stringify(value)),
				removeItem: (name: string) => storage.delete(name),
			},
		},
	),
)

export const useMiddleware = () => useMiddlewareStore((state) => state)
