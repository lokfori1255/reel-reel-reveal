
import { Reel, ReelSource, InstagramReel, LocalReel } from "../types/reels";

// Mock data for local reels
const mockLocalReels: LocalReel[] = [
  {
    id: "1",
    source: ReelSource.LOCAL,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-running-on-a-bridge-during-sunset-33535-large.mp4",
    thumbnailUrl: "https://cdn.pixabay.com/photo/2016/11/29/11/39/woman-1869116_1280.jpg",
    username: "fitness_lover",
    caption: "Morning run #fitness #health #running",
    likes: 1203,
    views: 5789
  },
  {
    id: "2",
    source: ReelSource.LOCAL,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-making-cookies-in-the-oven-2532-large.mp4",
    thumbnailUrl: "https://cdn.pixabay.com/photo/2016/11/29/11/45/dessert-1869227_1280.jpg",
    username: "bakewithme",
    caption: "Baking day! #cookies #baking #dessert",
    likes: 4567,
    views: 12345
  },
  {
    id: "3",
    source: ReelSource.LOCAL,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-road-seen-from-a-car-window-on-a-rainy-day-9001-large.mp4",
    thumbnailUrl: "https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832_1280.jpg",
    username: "travel_addict",
    caption: "Road trip vibes 🚗 #travel #roadtrip #adventure",
    likes: 3456,
    views: 8765
  },
  {
    id: "4",
    source: ReelSource.LOCAL,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-dancing-happily-in-a-field-4702-large.mp4",
    thumbnailUrl: "https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832_1280.jpg",
    username: "dance_queen",
    caption: "Express yourself through dance 💃 #dance #freedom #joy",
    likes: 6789,
    views: 19876
  },
  {
    id: "5",
    source: ReelSource.LOCAL,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4",
    thumbnailUrl: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
    username: "nature_explorer",
    caption: "Nature's beauty 🌿 #nature #waterfall #peaceful",
    likes: 8901,
    views: 23456
  },
  {
    id: "6",
    source: ReelSource.LOCAL,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-coffee-shop-working-on-laptop-513-large.mp4",
    thumbnailUrl: "https://cdn.pixabay.com/photo/2015/05/31/10/55/man-791049_1280.jpg",
    username: "digital_nomad",
    caption: "Coffee shop productivity #remote #work #coffee",
    likes: 2345,
    views: 7890
  }
];

// Mock data for Instagram reels
const mockInstagramReels: InstagramReel[] = [
  {
    id: "ig1",
    source: ReelSource.INSTAGRAM,
    videoUrl: "", // Not needed for Instagram embeds
    thumbnailUrl: "https://cdn.pixabay.com/photo/2016/11/19/14/00/code-1839406_1280.jpg",
    username: "instagram_official",
    caption: "Check out this cool Instagram Reel! #instagram #reels",
    likes: 15632,
    views: 89741,
    instagramUrl: "https://www.instagram.com/reel/Cz8s8B8OeZl/",
    instagramId: "Cz8s8B8OeZl"
  },
  {
    id: "ig2",
    source: ReelSource.INSTAGRAM,
    videoUrl: "", 
    thumbnailUrl: "https://cdn.pixabay.com/photo/2016/11/29/06/18/home-office-1867759_1280.jpg",
    username: "developer_life",
    caption: "Coding all night! #developer #coding #techllife",
    likes: 7845,
    views: 42356,
    instagramUrl: "https://www.instagram.com/reel/C1TfQPKIi1E/",
    instagramId: "C1TfQPKIi1E"
  },
  {
    id: "ig3",
    source: ReelSource.INSTAGRAM,
    videoUrl: "",
    thumbnailUrl: "https://cdn.pixabay.com/photo/2017/08/05/11/16/logo-2582748_1280.png",
    username: "webdev_tutorials",
    caption: "Learn React in 60 seconds! #react #webdev #tutorial",
    likes: 12453,
    views: 75362,
    instagramUrl: "https://www.instagram.com/reel/Cry9aDMvVSg/",
    instagramId: "Cry9aDMvVSg"
  }
];

// Combine all reels
const mockReels: Reel[] = [...mockLocalReels, ...mockInstagramReels];

// Function to search reels based on query
export const searchReels = (query: string): Promise<Reel[]> => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // If no query, return all reels
      if (!query) {
        resolve(mockReels);
        return;
      }
      
      // Filter reels based on query (username or caption)
      const filteredReels = mockReels.filter(
        (reel) =>
          reel.username.toLowerCase().includes(query.toLowerCase()) ||
          reel.caption.toLowerCase().includes(query.toLowerCase())
      );
      
      resolve(filteredReels);
    }, 500); // Simulate a 500ms delay
  });
};

// Function to get a specific reel by ID
export const getReelById = (id: string): Promise<Reel | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const reel = mockReels.find((r) => r.id === id);
      resolve(reel);
    }, 300);
  });
};
