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
	console.log('titleTemp0', titleTemp[1])
	titleTemp = titleTemp[1]
	console.log('titleTemp1', titleTemp)
	titleTemp = titleTemp.replace(/\(.*\)/, '')
	console.log('titleTemp2', titleTemp)
	titleTemp = titleTemp.replace('.', '')
	console.log('titleTemp3', titleTemp)
	if (titleTemp.includes('-')) {
		titleTemp = titleTemp.split('-').slice(1).join()
	}
	console.log('titleTemp4', titleTemp)

	titleTemp = titleTemp.trim()
	return titleTemp
}
