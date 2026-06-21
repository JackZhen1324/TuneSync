// import library from '@/assets/data/library.json'
import { create } from 'zustand'

interface CoverflowState {
	toggleDetail: boolean
	togleDetail: (togleDetail: boolean) => void
}

export const useCoverflowStore = create<CoverflowState>((set) => ({
	toggleDetail: false, // 使用外部传入的初始值

	togleDetail: (togleDetail) =>
		set(() => {
			return { toggleDetail: togleDetail }
		}), // 更新状态的方法
}))
