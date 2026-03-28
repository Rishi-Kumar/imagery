import { Platform } from 'react-native';

import type { GalleryImage, RedditListing, RedditPostData, RedditSource } from './types';

export async function fetchRedditImages(
  source: RedditSource,
  after: string | null,
  limit: number = 25,
): Promise<{ images: GalleryImage[]; after: string | null }> {
  const redditPath =
    source.type === 'subreddit'
      ? `/r/${source.name}.json`
      : `/user/${source.name}/submitted.json`;

  const redditParams = new URLSearchParams({ limit: String(limit), raw_json: '1' });
  if (after) redditParams.set('after', after);

  let res: Response;
  if (Platform.OS === 'web') {
    // Proxy through our API route to avoid CORS
    const proxyParams = new URLSearchParams({ path: `${redditPath}?${redditParams}` });
    res = await fetch(`/api/reddit?${proxyParams}`);
  } else {
    res = await fetch(`https://www.reddit.com${redditPath}?${redditParams}`);
  }

  if (!res.ok) {
    throw new Error(
      res.status === 404 ? 'Subreddit or user not found' : `Reddit API error: ${res.status}`,
    );
  }

  const listing: RedditListing = await res.json();
  const images = listing.data.children.flatMap((post) => extractImages(post.data));

  return { images, after: listing.data.after };
}

function extractImages(post: RedditPostData): GalleryImage[] {
  // 1. Gallery posts
  if (post.is_gallery && post.media_metadata && post.gallery_data) {
    return post.gallery_data.items
      .map((item) => {
        const meta = post.media_metadata![item.media_id];
        if (!meta || meta.status !== 'valid' || meta.e !== 'Image') return null;
        const thumb =
          meta.p?.length > 0 ? meta.p[Math.min(2, meta.p.length - 1)].u : meta.s.u;
        return {
          id: `${post.id}_${item.media_id}`,
          postTitle: post.title,
          author: post.author,
          imageUrl: meta.s.u,
          thumbnailUrl: thumb,
          width: meta.s.x,
          height: meta.s.y,
          permalink: `https://www.reddit.com${post.permalink}`,
        } satisfies GalleryImage;
      })
      .filter((img): img is GalleryImage => img !== null);
  }

  // 2. Direct image URLs
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i;
  if (post.post_hint === 'image' || imageExtensions.test(post.url)) {
    const preview = post.preview?.images?.[0];
    const thumb = pickThumbnail(preview?.resolutions) ?? post.url;
    return [
      {
        id: post.id,
        postTitle: post.title,
        author: post.author,
        imageUrl: post.url,
        thumbnailUrl: thumb,
        width: preview?.source?.width ?? 0,
        height: preview?.source?.height ?? 0,
        permalink: `https://www.reddit.com${post.permalink}`,
      },
    ];
  }

  // 3. Imgur non-direct links
  if (post.domain === 'imgur.com') {
    const match = post.url.match(/imgur\.com\/(\w+)$/);
    if (match) {
      const directUrl = `https://i.imgur.com/${match[1]}.jpg`;
      const preview = post.preview?.images?.[0];
      return [
        {
          id: post.id,
          postTitle: post.title,
          author: post.author,
          imageUrl: directUrl,
          thumbnailUrl: pickThumbnail(preview?.resolutions) ?? directUrl,
          width: preview?.source?.width ?? 0,
          height: preview?.source?.height ?? 0,
          permalink: `https://www.reddit.com${post.permalink}`,
        },
      ];
    }
  }

  // 4. Not an image post
  return [];
}

function pickThumbnail(
  resolutions?: Array<{ url: string; width: number; height: number }>,
): string | undefined {
  if (!resolutions || resolutions.length === 0) return undefined;
  return resolutions.reduce((best, r) =>
    Math.abs(r.width - 400) < Math.abs(best.width - 400) ? r : best,
  ).url;
}
