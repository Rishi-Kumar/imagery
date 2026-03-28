# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` — Start Expo dev server
- `npm run web` — Launch in web browser
- `npm run ios` — Launch iOS simulator
- `npm run android` — Launch Android emulator
- `npm run lint` — Run ESLint
- `npx tsc --noEmit` — Type-check (strict mode enabled)

## Architecture

Galleria is a cross-platform Reddit image gallery built with Expo (React Native), TypeScript, Zustand, and expo-image. Users enter a subreddit or username, browse a thumbnail grid, and tap to swipe through images full-screen.

### Routing (expo-router, file-based)

- `/` (`src/app/index.tsx`) — Home screen with subreddit/user input
- `/gallery/[source]` (`src/app/gallery/[source].tsx`) — 3-column image grid with infinite scroll
- `/viewer/[startIndex]` (`src/app/viewer/[startIndex].tsx`) — Full-screen vertical paging viewer
- `/api/reddit` (`src/app/api/reddit+api.ts`) — Server-side proxy for Reddit API (web only, to bypass CORS)

The `source` param encodes type and name with a hyphen: `r-earthporn` or `u-username`.

### Data flow

1. Input parsed into `RedditSource { type, name }` → Zustand store's `setSource()` + `fetchInitial()`
2. `lib/reddit.ts` fetches from Reddit JSON API (`raw_json=1` param is required). On web, requests proxy through `/api/reddit`; on native, direct fetch.
3. `extractImages()` handles 4 post types: gallery posts (media_metadata), direct image URLs, imgur links, and skips everything else.
4. Images stored in Zustand; both grid and viewer read from the same store. Pagination uses Reddit's `after` cursor via `fetchMore()`.

### Key conventions

- Path aliases: `@/*` → `./src/*`, `@/assets/*` → `./assets/*`
- Dark theme: `#000` background, `#fff` text, `#ff4500` accent (Reddit orange)
- Web output mode is `server` (not static) to support the API route
- `typedRoutes` and `reactCompiler` experiments are enabled
- Memoize grid tile components to prevent re-render during scroll
- `getItemLayout` is required on FlatLists that use `initialScrollIndex`
