
export interface Reel {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  username: string;
  caption: string;
  likes: number;
  views: number;
  instagramUrl?: string; // Optional Instagram reel URL for embedding
}

export enum ReelSource {
  LOCAL = "local",
  INSTAGRAM = "instagram"
}

export interface InstagramReel extends Reel {
  source: ReelSource.INSTAGRAM;
  instagramUrl: string; // Required for Instagram reels
  instagramId: string;  // Instagram post ID
}

export interface LocalReel extends Reel {
  source: ReelSource.LOCAL;
}
