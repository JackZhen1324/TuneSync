/*
 * @Author: Zhen Qian zqian15@asu.edu
 * @Date: 2025-02-13 18:25:50
 * @LastEditors: zhen qian xhdp123@126.com
 * @LastEditTime: 2025-03-03 17:19:09
 * @FilePath: /TuneSync/src/helpers/utils.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * throttle函数：在 wait 时间间隔内，仅允许 fn 执行一次
 * @param {Function} fn     - 需要被截流的目标函数
 * @param {number} wait     - 时间间隔（毫秒）
 * @returns {Function}      - 加强版函数（已被截流）
 */
export function throttle(fn, wait) {
	let lastCallTime = 0

	return function (...args) {
		const now = Date.now()

		// 如果距离上次执行已超过 wait，则执行 fn
		if (now - lastCallTime >= wait) {
			lastCallTime = now
			fn.apply(this, args)
		}
	}
}
export function titleFormater(title: string) {
	let titleTemp = (title || '').match(/(.+?)(\.[^.]*$|$)/) || ''
	titleTemp = titleTemp[1]
	titleTemp = titleTemp.replace(/\(.*\)/, '')
	titleTemp = titleTemp.replace('.', '')

	if (titleTemp.includes('-')) {
		titleTemp = titleTemp.split('-').slice(1).join()
	}

	titleTemp = titleTemp.trim()

	return titleTemp
}
export const truncateFileName = (name, maxLength) => {
	if (!name) return ''
	if (name.length <= maxLength) return name
	return name.slice(0, maxLength - 3) + '...'
}

export const equals = (objA, objB) => {
	// 浅比较
	// 检查两个对象的引用是否相等
	if (objA === objB) return true

	// 检查对象的键数量是否相等
	const keysA = Object.keys(objA)
	const keysB = Object.keys(objB)
	if (keysA.length !== keysB.length) return false

	// 检查每个键的值是否相等
	for (const key of keysA) {
		if (objA[key] !== objB[key]) {
			return false // 发现不同的值，返回 false
		}
	}

	return true // 所有第一层属性值都相同
}

export const getFormatedDate = () => {
	const today = new Date()

	//日期
	const DD = String(today.getDate()).padStart(2, '0') // 获取日
	const MM = String(today.getMonth() + 1).padStart(2, '0') //获取月份，1 月为 0
	const yyyy = today.getFullYear() // 获取年

	// 时间
	const hh = String(today.getHours()).padStart(2, '0') //获取当前小时数(0-23)
	const mm = String(today.getMinutes()).padStart(2, '0') //获取当前分钟数(0-59)
	const ss = String(today.getSeconds()).padStart(2, '0') //获取当前秒数(0-59)
	return '[' + yyyy + '-' + MM + '-' + DD + ' ' + hh + ':' + mm + ':' + ss + ']'
}

export function filterOuterPaths(paths: string[]) {
	const sortedPaths = paths.sort((a, b) => a.dir.length - b.dir.length)
	const resultTemp = new Set<string>()
	sortedPaths.forEach(({ dir: path }) => {
		const check = ![...resultTemp].some((el) => {
			return path.startsWith(el)
		})
		if (check) {
			resultTemp.add(path)
		}
	})
	const result = sortedPaths.filter((el) => [...resultTemp].includes(el.dir))
	return [...result]
}
