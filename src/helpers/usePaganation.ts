import { useState } from 'react'

export default (props) => {
	const { data = [] } = props
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)

	return [(data || [])?.slice(0, page * pageSize), setPage, page]
}
