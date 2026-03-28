import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';

import { useGalleryStore } from '@/lib/store';
import type { GalleryImage } from '@/lib/types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  image: GalleryImage;
}

export function FullScreenImage({ image }: Props) {
  const router = useRouter();
  const { setSource, fetchInitial } = useGalleryStore();

  const openUserGallery = () => {
    setSource({ type: 'user', name: image.author });
    fetchInitial();
    router.push(`/gallery/u-${image.author}`);
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: image.imageUrl }}
        style={styles.image}
        contentFit="contain"
        transition={300}
      />
      <View style={styles.overlay}>
        <Text style={styles.title} numberOfLines={2}>
          {image.postTitle}
        </Text>
        <Pressable onPress={openUserGallery}>
          <Text style={styles.link}>u/{image.author}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 48,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  link: {
    color: '#ff4500',
    fontSize: 14,
    marginTop: 8,
  },
});
