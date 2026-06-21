import * as FileSystem from 'expo-file-system'
import { MMKV } from 'react-native-mmkv'
const documentDirectory = FileSystem.documentDirectory
export const storage = new MMKV()
