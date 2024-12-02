import { HeaderMemu } from '@/components/headerMenu'
import { StopPropagation } from '@/components/utils/StopPropagation'
import { StackScreenWithSearchBar } from '@/constants/layout'
import { colors } from '@/constants/tokens'
import { debounce } from '@/helpers/debounce'
import { indexingLocal } from '@/helpers/indexing/local'
import { fetchMetadata } from '@/helpers/indexing/metadata'
import { indexingWebdav } from '@/helpers/indexing/webdav'
import useThemeColor from '@/hooks/useThemeColor'
import { useActiveTrack, useIndexStore, useLibraryStore } from '@/store/library'
import { useQueueStore } from '@/store/queue'
import { defaultStyles } from '@/styles'
import { Entypo } from '@expo/vector-icons'
import { useIsFocused } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import TrackPlayer from 'react-native-track-player'
let currentAbortController: AbortController | null = null
const BATCH_SIZE = 1;
let updates: Array<{ title: string; url: string; pendingMeta?: boolean }> = [];

const asyncPool = async (poolLimit, array, iteratorFn) => {
  const ret = [];   // Array of results
  const executing = []; // Array of executing promises
  for (const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item));
    ret.push(p);

    if (poolLimit <= array.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);

      if (executing.length >= poolLimit) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.allSettled(ret);
};

const SongsScreenLayout = () => {
  const { t } = useTranslation()
  const isFocused = useIsFocused()
  const { loading, current, setLoading, indexingList, setNeedUpdate, needUpdate } = useIndexStore()
  const { setTracks, tracks, tracksMap, update, batchUpdate } = useLibraryStore((state: any) => state)
  const { setActiveTrack, activeTrack } = useActiveTrack((state: any) => state)
  
  const theme = useThemeColor()
  const {
    setActiveQueueId,
    activeQueueId,
    queueListWithContent,
    setQueueListContent,
    updateQueue,
    batchUpdateQueue,
  } = useQueueStore((state: any) => state)
  const refresh = useCallback(() => {
    setTracks(tracksMap)
    setActiveQueueId(activeQueueId)
  }, [activeQueueId, setActiveQueueId, setTracks, tracksMap])

  const refreshLibrary = useCallback(async () => {
    try {
      // If there's a previous request, abort it
      if (currentAbortController) {
        console.log('aborting')
        currentAbortController.abort()
      }
      // Create a new AbortController
      currentAbortController = new AbortController()
      const signal = currentAbortController.signal
      setLoading({ loading: true, percentage: 0, current: '' })
      const localIndexing = indexingList.filter((el: { from: string }) => el.from === 'local')
      const webdavIndexing = indexingList.filter((el: { from: string }) => el.from !== 'local')
      const start = performance.now()
      const localMusices = await indexingLocal(localIndexing, refresh)
      const webdavMusices = await indexingWebdav(webdavIndexing, refresh)

      setLoading({
        loading: false,
        percentage: 100,
        current: '',
      })
      const musicTotal = [...localMusices, ...webdavMusices]

      const formatedMusicTotal = {} as any
      const songTitles = musicTotal?.map((el) => {
        const { title } = el
        el.pendingMeta = true
        formatedMusicTotal[title] = el
        return title
      })

      const filteredQueue = queueListWithContent[activeQueueId]
        ?.map((el: { title: string }, index: number) => {
          return songTitles.includes(el.title) ? -1 : index
        })
        ?.filter((el: number) => el > -1)
      if (!songTitles.includes(activeTrack)) {
        setActiveTrack(undefined)
      }

      setTracks(formatedMusicTotal)
      setQueueListContent(
        queueListWithContent[activeQueueId]?.filter(
          (_el: any, index: any) => !filteredQueue.includes(index),
        ),
        activeQueueId,
        queueListWithContent,
      )
      const end = performance.now()
      console.log('cost is', `${end - start}ms`)
      await TrackPlayer.remove(filteredQueue)
      
      // Clear updates array before starting
      updates = [];

      // Use asyncPool to limit concurrency
      await asyncPool(5, musicTotal, async (el, i) => {
        const { title } = el;
        if (signal.aborted) {
          return;
        }

        try {
          // Fetch metadata
          const meta = await fetchMetadata({ title, webdavUrl: el.url }, signal)
          meta.title = title
          if (!signal.aborted) {
            updates.push(meta)
            if (updates.length % BATCH_SIZE === 0) {
              batchUpdate(updates)
              batchUpdateQueue(updates)
              updates = [];
            }
            const currentSong = await TrackPlayer.getActiveTrack();
            if (currentSong && currentSong.basename === el.title) {
              setActiveTrack(meta)
            }
          }
        } catch (error) {
          console.error(`Error fetching metadata for ${title}:`, error)
        }
      });

      // Process any remaining updates
      if (updates.length > 0) { 
        batchUpdate(updates)
        batchUpdateQueue(updates)
      }
      setLoading({ loading: false, percentage: 0, current: '' })
      setNeedUpdate(false)
    } catch (error) {
      console.log('error', error)

      setLoading({ loading: false, percentage: 0, current: '' })
      setNeedUpdate(false)
    } finally {
      // Clear the abort controller
      currentAbortController = null
    }
  }, [
    activeQueueId,
    activeTrack,
    batchUpdate,
    batchUpdateQueue,
    indexingList,
    queueListWithContent,
    refresh,
    setActiveTrack,
    setLoading,
    setNeedUpdate,
    setQueueListContent,
    setTracks,
  ])

  const debouncedRefreshLibrary = useCallback(debounce(refreshLibrary, 0), [refreshLibrary])

  useEffect(() => {
    currentAbortController = new AbortController()
    const signal = currentAbortController.signal
    setLoading({ loading: false, percentage: 0, current: '' })
    const resumeMetadataExtraction = async () => {
      // Clear updates array before starting
      updates = [];

      // Use asyncPool to limit concurrency
      await asyncPool(5, tracks, async (el, i) => {
        const { title, pendingMeta } = el
        if (signal.aborted) {
          return
        }
		// skip if already fetched
		if(!pendingMeta) {
			return
		}
		
        try {
          // Fetch metadata
          const meta = await fetchMetadata({ title, webdavUrl: el.url }, signal)
		  meta.title = title
          if (!signal.aborted) {
            updates.push(meta)
            if (updates.length % BATCH_SIZE === 0) {
              batchUpdate(updates)
              batchUpdateQueue(updates)
              updates = [];
            }
            const currentSong = await TrackPlayer.getActiveTrack();
            if (currentSong && currentSong.basename === el.title) {
              setActiveTrack(meta)
            }
          }
        } catch (error) {
          console.error(`Error fetching metadata for ${title}:`, error)
        }
      });

      // Process any remaining updates
      if (updates.length > 0) { 
        batchUpdate(updates)
        batchUpdateQueue(updates)
      }
    }

    resumeMetadataExtraction()

    return () => {
      // Cleanup on unmount
      if (currentAbortController) {
        currentAbortController.abort()
      }
    }
  }, [])

  useEffect(() => {
    if (isFocused && needUpdate) {
      try {
        debouncedRefreshLibrary()
        setNeedUpdate(false)
      } catch (error) {
        console.log('error', error)
      }
    }
  }, [needUpdate, debouncedRefreshLibrary, isFocused, setNeedUpdate])

  return (
    <SafeAreaView style={defaultStyles.container}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            ...StackScreenWithSearchBar,
            headerLargeTitle: true,
            headerTitle: t('songs.header'),
            headerRight: () => {
              return (
                <StopPropagation>
                  {loading ? (
                    <View>
                      <ActivityIndicator
                        style={{
                          position: 'absolute',
                          right: 0,
                        }}
                        size="small"
                      />
                      <Text
                        style={{
                          color: theme.colors.text,
                          fontSize: 12,
                          position: 'absolute',
                          right: 0,
                          top: 24,
                        }}
                      >
                        {current}
                      </Text>
                    </View>
                  ) : (
                    <HeaderMemu refreshLibrary={refreshLibrary}>
                      <Entypo name="dots-three-horizontal" size={18} color={colors.icon} />
                    </HeaderMemu>
                  )}
                </StopPropagation>
              )
            },
          }}
        />
      </Stack>
    </SafeAreaView>
  )
}

export default SongsScreenLayout