import { useCallback, useEffect, useRef, useState } from 'react'
export function useStateCallback(initialState: any) {
	const [state, setState] = useState(initialState)
	const cbRef = useRef(null) // init mutable ref container for callbacks

	const setStateCallback = useCallback((state: any, cb: null) => {
		cbRef.current = cb // store current, passed callback in ref
		setState(state)
	}, []) // keep object reference stable, exactly like `useState`

	useEffect(() => {
		// cb.current is `null` on initial render,
		// so we only invoke callback on state *updates*
		if (cbRef.current) {
			cbRef.current(state)
			cbRef.current = null // reset callback after execution
		}
	}, [state])

	return [state, setStateCallback]
}
