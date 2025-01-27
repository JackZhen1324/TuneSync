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
