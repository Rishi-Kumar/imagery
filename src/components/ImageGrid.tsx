import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import { ImageTile } from './ImageTile';
import { useGalleryStore } from '@/lib/store';
import { GRID_COLUMNS, GRID_GAP, TILE_SIZE } from '@/lib/constants';
import type { GalleryImage } from '@/lib/types';

export function ImageGrid() {
  const { images, isLoading, fetchMore } = useGalleryStore();

  const renderItem = useCallback(
    ({ item, index }: { item: GalleryImage; index: number }) => (
      <ImageTile image={item} index={index} />
    ),
    [],
  );

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: TILE_SIZE + GRID_GAP,
      offset: (TILE_SIZE + GRID_GAP) * Math.floor(index / GRID_COLUMNS),
      index,
    }),
    [],
  );

  return (
    <FlatList
      data={images}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={GRID_COLUMNS}
      columnWrapperStyle={styles.row}
      getItemLayout={getItemLayout}
      onEndReached={fetchMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isLoading ? (
          <View style={styles.footer}>
            <ActivityIndicator size="small" color="#ff4500" />
          </View>
        ) : null
      }
      style={styles.list}
      contentContainerStyle={styles.content}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    paddingBottom: 20,
  },
  row: {
    gap: GRID_GAP,
    marginBottom: GRID_GAP,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
});
