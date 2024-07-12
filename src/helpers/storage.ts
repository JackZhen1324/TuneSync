'use strict'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Callback } from '@react-native-async-storage/async-storage/lib/typescript/types'
import { Component } from 'react'

class StorageUtil extends Component {
	/*
	 * 保存
	 * */
	static save(key: string, value: any, callback: Callback | undefined) {
		return AsyncStorage.setItem(key, JSON.stringify(value), callback)
	}
	/*
	 * 获取
	 * */
	static get(key: string) {
		return AsyncStorage.getItem(key).then((value) => {
			const jsonValue = JSON.parse(value || '')
			return jsonValue
		})
	}
	/*
	 * 更新
	 * */
	static update(key: string, value: any, callback: Callback | undefined) {
		StorageUtil.get(key).then((item) => {
			value = typeof value === 'string' ? value : Object.assign({}, item, value)
			return AsyncStorage.setItem(key, JSON.stringify(value), callback)
		})
	}
	/*
	 * 删除
	 * */
	static delete(key: string, callback: Callback | undefined) {
		AsyncStorage.removeItem(key, callback)
	}
}

export default StorageUtil
