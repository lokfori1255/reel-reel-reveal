
import { useState, useEffect } from "react";
import { searchReels } from "../services/mockReelsService";
import { Reel } from "../types/reels";
import SearchBar from "../components/SearchBar";
import ReelCard from "../components/ReelCard";
import VideoPlayer from "../components/VideoPlayer";
import { Instagram } from "lucide-react";

const Index = () => {
  const [reels, setReels] = useState<Reel[]>([]);
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
          <SearchBar onSearch={handleSearch} />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-secondary animate-pulse rounded-md"></div>
            ))}
          </div>
        ) : reels.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {reels.map((reel) => (
              <ReelCard
                key={reel.id}
                reel={reel}
                onClick={() => handleReelClick(reel)}
              />
            ))}
          </div>
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
                <p className="text-xl font-medium">Start searching for reels</p>
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
