'use strict'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Callback } from '@react-native-async-storage/async-storage/lib/typescript/types'

class StorageUtil {
	/*
	 * 保存
	 * */
	static save(key: string, value: any, callback?: Callback) {
		return AsyncStorage.setItem(key, JSON.stringify(value), callback)
	}

	/*
	 * 获取
	 * */
	static async get(key: string) {
		try {
			const value = await AsyncStorage.getItem(key)
			return value != null ? JSON.parse(value) : null
		} catch (error) {
			console.error(`Error parsing JSON for key "${key}":`, error)
			return null
		}
	}

	/*
	 * 更新
	 * */
	static async update(key: string, value: any, callback?: Callback) {
		try {
			const item = await StorageUtil.get(key)
			const newValue = typeof value === 'string' ? value : Object.assign({}, item, value)
			return AsyncStorage.setItem(key, JSON.stringify(newValue), callback)
		} catch (error) {
			console.error(`Error updating key "${key}":`, error)
		}
	}

	/*
	 * 删除
	 * */
	static delete(key: string, callback?: Callback) {
		return AsyncStorage.removeItem(key, callback)
	}

	/*
	 * 清除所有数据
	 * */
	static clear(callback?: Callback) {
		return AsyncStorage.clear(callback)
	}
}

export default StorageUtil
