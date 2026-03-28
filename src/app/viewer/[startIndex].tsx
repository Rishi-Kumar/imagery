import { Redirect, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { FullScreenViewer } from '@/components/FullScreenViewer';
import { useGalleryStore } from '@/lib/store';

export default function ViewerScreen() {
  const { startIndex } = useLocalSearchParams<{ startIndex: string }>();
  const images = useGalleryStore((s) => s.images);

  if (images.length === 0) {
    return <Redirect href="/" />;
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <FullScreenViewer initialIndex={Number(startIndex) || 0} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
