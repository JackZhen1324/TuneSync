// import library from '@/assets/data/library.json'
import { create } from 'zustand'

interface PlayerState {
	playing: boolean
	setIsPlaying: (isPlaying?: boolean) => void
	cacheResetTrigger: boolean
	fireCacheResetTrigger: () => void
}

export const usePlayerStore = create<PlayerState>((set) => ({
	playing: false, // 使用外部传入的初始值
	cacheResetTrigger: false,
	setIsPlaying: (isPlaying) =>
		set(() => {
			return { playing: isPlaying }
		}), // 更新状态的方法
	fireCacheResetTrigger: () => set((state) => ({ cacheResetTrigger: !state.cacheResetTrigger })),
}))
