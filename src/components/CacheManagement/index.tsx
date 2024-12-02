import { colors as tokens } from '@/constants/tokens';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    Alert,
    PermissionsAndroid,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';
import RNFS from 'react-native-fs';

const CACHE_DIR = `${RNFS.DocumentDirectoryPath}/music_cache`;

const CacheManagement = () => {
    const { t } = useTranslation()
  const [cacheSize, setCacheSize] = useState(0);
  const navigation = useNavigation();
  const colorScheme = useColorScheme(); // 获取当前的主题（'light' 或 'dark'）

  useEffect(() => {
    requestStoragePermission();
    calculateCacheSize();
  }, []);

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: '存储权限请求',
            message: '应用需要访问您的存储以管理缓存',
            buttonNeutral: '稍后询问',
            buttonNegative: '拒绝',
            buttonPositive: '允许',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('权限未授予', '无法访问存储，缓存管理功能可能无法正常工作');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const calculateCacheSize = async () => {
    try {
      const exists = await RNFS.exists(CACHE_DIR);
      if (!exists) {
        setCacheSize(0);
        return;
      }

      const result = await RNFS.readDir(CACHE_DIR);
      let totalSize = 0;

      for (const file of result) {
        const fileInfo = await RNFS.stat(file.path);
        totalSize += fileInfo.size;
      }

      setCacheSize((totalSize / (1024 * 1024)).toFixed(2));
    } catch (error) {
      console.error('计算缓存大小时出错：', error);
    }
  };

  const clearCache = async () => {
    Alert.alert(
      '清空缓存',
      '确定要清空缓存吗？',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确定',
          onPress: async () => {
            try {
              const exists = await RNFS.exists(CACHE_DIR);
              if (exists) {
                await RNFS.unlink(CACHE_DIR);
                await RNFS.mkdir(CACHE_DIR);
              }
              setCacheSize(0);
              Alert.alert('提示', '缓存已清空');
            } catch (error) {
              console.error('清空缓存时出错：', error);
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  // 根据主题设置颜色
  const isDarkMode = colorScheme === 'dark';

  const colors = {
    background: isDarkMode ? '#121212' : '#f9f9f9',
    cardBackground: isDarkMode ? '#1e1e1e' : '#fff',
    text: isDarkMode ? '#fff' : '#000',
    secondaryText: isDarkMode ? '#aaa' : '#666',
    iconColor: isDarkMode ? '#fff' : '#000',
    buttonBackground: '#6200ee', // 使用主题色的按钮
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />


      {/* 内容部分 */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* 缓存信息卡片 */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.cardContent}>
            <MaterialIcons name="storage" size={40} color={tokens.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>{t('cache.size')}</Text>
            <Text style={[styles.cardSubtitle, { color: colors.secondaryText }]}>
              {cacheSize} MB
            </Text>
          </View>
        </View>

        {/* 操作按钮 */}
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={clearCache}
            style={[styles.actionButton, { backgroundColor: tokens.primary }]}
          >
            <Ionicons name="trash-outline" size={20} color={tokens.text} style={{ marginRight: 8 }} />
            <Text style={styles.actionButtonText}>{t('cache.clean')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 4,
  },
  title: {
    flex: 1,
    fontSize: 20,
    textAlign: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  
  },
  card: {
    width: '100%',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000', // 添加阴影效果（iOS）
    shadowOffset: { width: 0, height: 1 }, // 添加阴影效果（iOS）
    shadowOpacity: 0.2, // 添加阴影效果（iOS）
    shadowRadius: 1.41, // 添加阴影效果（iOS）
  },
  cardContent: {
    padding: 16,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  cardSubtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  actions: {
    width: '100%',
    alignItems: 'center',
    marginTop: 32,
  },
  actionButton: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CacheManagement;