import { create } from 'zustand';

import { fetchRedditImages } from './reddit';
import type { GalleryImage, RedditSource } from './types';

interface GalleryStore {
  source: RedditSource | null;
  images: GalleryImage[];
  after: string | null;
  isLoading: boolean;
  error: string | null;

  setSource: (source: RedditSource) => void;
  fetchInitial: () => Promise<void>;
  fetchMore: () => Promise<void>;
  reset: () => void;
}

export const useGalleryStore = create<GalleryStore>((set, get) => ({
  source: null,
  images: [],
  after: null,
  isLoading: false,
  error: null,

  setSource: (source) => set({ source, images: [], after: null, error: null }),

  fetchInitial: async () => {
    const { source } = get();
    if (!source) return;

    set({ isLoading: true, error: null, images: [], after: null });
    try {
      const result = await fetchRedditImages(source, null);
      set({ images: result.images, after: result.after, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  fetchMore: async () => {
    const { source, after, isLoading } = get();
    if (!source || !after || isLoading) return;

    set({ isLoading: true });
    try {
      const result = await fetchRedditImages(source, after);
      set((state) => ({
        images: [...state.images, ...result.images],
        after: result.after,
        isLoading: false,
      }));
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  reset: () => set({ source: null, images: [], after: null, isLoading: false, error: null }),
}));
