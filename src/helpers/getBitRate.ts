export const getBitRate = (filesize: number, songLength: number) => {
	if (filesize && songLength) {
		return Math.ceil((filesize / songLength) * 8)
	}
	return ''
}
