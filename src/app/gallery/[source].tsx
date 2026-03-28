import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { ImageGrid } from '@/components/ImageGrid';
import { useGalleryStore } from '@/lib/store';

function decodeSource(encoded: string): { label: string } {
  if (encoded.startsWith('r-')) return { label: `r/${encoded.slice(2)}` };
  if (encoded.startsWith('u-')) return { label: `u/${encoded.slice(2)}` };
  return { label: encoded };
}

export default function GalleryScreen() {
  const { source } = useLocalSearchParams<{ source: string }>();
  const { label } = decodeSource(source ?? '');
  const { images, isLoading, error, fetchInitial } = useGalleryStore();

  useEffect(() => {
    if (images.length === 0 && !isLoading && !error) {
      fetchInitial();
    }
  }, []);

  if (error) {
    return (
      <>
        <Stack.Screen options={{ title: label }} />
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryText} onPress={fetchInitial}>
            Tap to retry
          </Text>
        </View>
      </>
    );
  }

  if (isLoading && images.length === 0) {
    return (
      <>
        <Stack.Screen options={{ title: label }} />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#ff4500" />
        </View>
      </>
    );
  }

  if (!isLoading && images.length === 0) {
    return (
      <>
        <Stack.Screen options={{ title: label }} />
        <View style={styles.center}>
          <Text style={styles.emptyText}>No images found</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: label }} />
      <ImageGrid />
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  errorText: {
    color: '#ff4500',
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  retryText: {
    color: '#888',
    fontSize: 14,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
});
