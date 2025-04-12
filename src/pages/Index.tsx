import { useState, useEffect } from "react";
import { searchReels } from "../services/mockReelsService";
import { Reel, ReelSource } from "../types/reels";
import SearchBar from "../components/SearchBar";
import ReelCard from "../components/ReelCard";
import VideoPlayer from "../components/VideoPlayer";
import { Instagram } from "lucide-react";

const Index = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [recommendedReels, setRecommendedReels] = useState<Reel[]>([]);
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Load all reels on initial mount
    loadReels("");
  }, []);

  const loadReels = async (query: string) => {
    setIsLoading(true);
    setIsSearching(!!query);
    
    try {
      const results = await searchReels(query);
      setReels(results);
      
      // Generate recommendations based on search results
      if (query && results.length > 0) {
        // Get instagram reels from results if any
        const instagramReels = results.filter(reel => 
          'source' in reel && reel.source === ReelSource.INSTAGRAM
        );
        
        // Add instagram reels to recommendations if they exist
        if (instagramReels.length > 0) {
          setRecommendedReels(instagramReels.slice(0, 3));
        } else {
          // Otherwise recommend highest view count reels
          const sortedByViews = [...results].sort((a, b) => b.views - a.views);
          setRecommendedReels(sortedByViews.slice(0, 3));
        }
      } else if (!query) {
        // Default recommendations for empty search
        const allResults = await searchReels("");
        const sortedByLikes = [...allResults].sort((a, b) => b.likes - a.likes);
        setRecommendedReels(sortedByLikes.slice(0, 3));
      }
    } catch (error) {
      console.error("Error loading reels:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    loadReels(query);
  };

  const handleReelClick = (reel: Reel) => {
    setSelectedReel(reel);
  };

  const handleClosePlayer = () => {
    setSelectedReel(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Instagram className="w-8 h-8 text-instagram-pink" />
              <h1 className="text-xl font-bold bg-instagram-gradient text-transparent bg-clip-text">
                Reel Reveal
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <SearchBar 
            onSearch={handleSearch} 
            placeholder="Search Instagram reels..."
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-secondary animate-pulse rounded-md"></div>
            ))}
          </div>
        ) : reels.length > 0 ? (
          <>
            {recommendedReels.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 bg-instagram-gradient text-transparent bg-clip-text">
                  Recommended Reels
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {recommendedReels.map((reel) => (
                    <ReelCard
                      key={`recommended-${reel.id}`}
                      reel={reel}
                      onClick={() => handleReelClick(reel)}
                      isRecommended={true}
                    />
                  ))}
                </div>
              </div>
            )}

            <h2 className="text-xl font-semibold mb-4">
              {searchQuery ? `Results for "${searchQuery}"` : "All Reels"}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {reels.map((reel) => (
                <ReelCard
                  key={reel.id}
                  reel={reel}
                  onClick={() => handleReelClick(reel)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            {isSearching ? (
              <div>
                <p className="text-xl font-medium mb-2">No reels found</p>
                <p className="text-muted-foreground">
                  Try a different search term or browse all reels
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xl font-medium">Start searching for Instagram reels</p>
              </div>
            )}
          </div>
        )}
      </main>

      {selectedReel && <VideoPlayer reel={selectedReel} onClose={handleClosePlayer} />}
    </div>
  );
};

export default Index;
