# Galleria — Reddit Image Gallery App

## Overview
Cross-platform (iOS, Android, web) image gallery that displays images from any subreddit or Reddit user. Browse thumbnails in a grid, tap to enter full-screen vertical swipe mode.

## Stack
- **Expo** (React Native) with expo-router for file-based navigation
- **TypeScript** throughout
- **Zustand** for state management
- **expo-image** for performant image rendering
- **Reddit JSON API** (no auth — appends `.json` to URLs with `raw_json=1`)

## Architecture

### Navigation (expo-router)
```
Stack
├── /                     → Home (subreddit/user input)
├── /gallery/[source]     → Image grid (3 columns, infinite scroll)
└── /viewer/[startIndex]  → Full-screen vertical swipe viewer
```

### Data Flow
1. User enters `r/earthporn` or `u/username` on home screen
2. Input parsed into `RedditSource { type, name }`
3. Zustand store fetches `reddit.com/r/{name}.json?raw_json=1`
4. Posts filtered through `extractImages()` — handles direct images, galleries, imgur links
5. Grid displays thumbnails with infinite scroll (Reddit `after` cursor pagination)
6. Tap → full-screen viewer reads same store, starts at tapped index
7. Swipe up/down navigates between images; also supports infinite scroll

### Key Files
- `src/lib/reddit.ts` — API client + image URL extraction (handles 4 post types)
- `src/lib/store.ts` — Zustand store (images, pagination, loading)
- `src/lib/types.ts` — TypeScript interfaces for Reddit API + app models
- `src/components/ImageGrid.tsx` — 3-column FlatList grid
- `src/components/FullScreenViewer.tsx` — Vertical paging FlatList

## Running
```bash
npm start        # Start Expo dev server
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Web browser
```
