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
