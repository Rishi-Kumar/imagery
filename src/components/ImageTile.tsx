import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { TILE_SIZE } from '@/lib/constants';
import type { GalleryImage } from '@/lib/types';

interface Props {
  image: GalleryImage;
  index: number;
}

export const ImageTile = memo(function ImageTile({ image, index }: Props) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/viewer/${index}`)}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
    >
      <Image
        source={{ uri: image.thumbnailUrl }}
        style={styles.image}
        contentFit="cover"
        transition={200}
        recyclingKey={image.id}
        cachePolicy="memory-disk"
        priority="normal"
      />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
  },
  pressed: {
    opacity: 0.7,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
