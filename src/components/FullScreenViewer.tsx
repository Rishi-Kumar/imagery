import React, { useCallback } from 'react';
import { Dimensions, FlatList, StyleSheet } from 'react-native';

import { FullScreenImage } from './FullScreenImage';
import { useGalleryStore } from '@/lib/store';
import type { GalleryImage } from '@/lib/types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  initialIndex: number;
}

export function FullScreenViewer({ initialIndex }: Props) {
  const { images, fetchMore } = useGalleryStore();

  const renderItem = useCallback(
    ({ item }: { item: GalleryImage }) => <FullScreenImage image={item} />,
    [],
  );

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: SCREEN_HEIGHT,
      offset: SCREEN_HEIGHT * index,
      index,
    }),
    [],
  );

  return (
    <FlatList
      data={images}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      pagingEnabled
      getItemLayout={getItemLayout}
      initialScrollIndex={initialIndex}
      onEndReached={fetchMore}
      onEndReachedThreshold={0.5}
      showsVerticalScrollIndicator={false}
      windowSize={3}
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#000',
  },
});
