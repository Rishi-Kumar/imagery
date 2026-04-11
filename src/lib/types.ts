export interface GalleryImage {
  id: string;
  postTitle: string;
  author: string;
  imageUrl: string;
  previewUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  permalink: string;
}

export interface RedditSource {
  type: 'subreddit' | 'user';
  name: string;
}

export interface RedditListing {
  kind: 'Listing';
  data: {
    after: string | null;
    children: RedditPost[];
  };
}

export interface RedditPost {
  kind: 't3';
  data: RedditPostData;
}

export interface RedditPostData {
  id: string;
  author: string;
  title: string;
  url: string;
  permalink: string;
  post_hint?: string;
  is_gallery?: boolean;
  domain: string;
  thumbnail: string;
  is_video: boolean;
  preview?: {
    images: Array<{
      source: { url: string; width: number; height: number };
      resolutions: Array<{ url: string; width: number; height: number }>;
    }>;
  };
  media_metadata?: Record<
    string,
    {
      status: string;
      e: string;
      m: string;
      s: { u: string; x: number; y: number };
      p: Array<{ u: string; x: number; y: number }>;
    }
  >;
  gallery_data?: {
    items: Array<{ media_id: string; caption?: string }>;
  };
}
