export function throttled(fn, delay) {
	let timer = null
	let starttime = Date.now()
	return function () {
		const curTime = Date.now() // 当前时间
		const remaining = delay - (curTime - starttime) // 从上一次到现在，还剩下多少多余时间
		const context = this
		const args = arguments
		clearTimeout(timer)
		if (remaining <= 0) {
			fn.apply(context, args)
			starttime = Date.now()
		} else {
			timer = setTimeout(fn, remaining)
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
