import { Image } from 'expo-image';
import React, { useCallback, useRef } from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  type ViewToken,
} from 'react-native';

import { FullScreenImage } from './FullScreenImage';
import { useGalleryStore } from '@/lib/store';
import type { GalleryImage } from '@/lib/types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;
  const imagesRef = useRef(images);
  imagesRef.current = images;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const current = viewableItems[0]?.index;
      if (current == null) return;
      const all = imagesRef.current;
      const urls = [all[current + 1], all[current + 2], all[current - 1]]
        .map((img) => img?.previewUrl)
        .filter((u): u is string => Boolean(u));
      if (urls.length > 0) {
        Image.prefetch(urls, 'memory-disk');
      }
    },
  ).current;

  return (
    <FlatList
      data={images}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      pagingEnabled
      getItemLayout={getItemLayout}
      initialScrollIndex={initialIndex}
      onEndReached={fetchMore}
      onEndReachedThreshold={1.2}
      showsVerticalScrollIndicator={false}
      initialNumToRender={1}
      maxToRenderPerBatch={2}
      windowSize={3}
      removeClippedSubviews={Platform.OS !== 'web'}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
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
