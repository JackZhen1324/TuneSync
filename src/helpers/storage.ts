'use strict'
import { storage } from '@/store/mkkv'

class StorageUtil {
	/*
	 * 保存
	 * */
	static set(key: string, value: any) {
		return storage.set(key, JSON.stringify(value))
	}

	/*
	 * 获取
	 * */
	static async get(key: string) {
		try {
			const value = storage.getString(key)
			return value != null ? JSON.parse(value) : null
		} catch (error) {
			console.error(`Error parsing JSON for key "${key}":`, error)
			return null
		}
	}
	/*
	 * 清除所有数据
	 * */
	static clear() {
		return storage.clearAll()
	}
}

export default StorageUtil
