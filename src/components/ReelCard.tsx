
import { useState } from "react";
import { Reel, ReelSource } from "../types/reels";
import { Play, Heart, Eye, Instagram } from "lucide-react";
import { formatCompactNumber } from "../utils/formatNumber";

interface ReelCardProps {
  reel: Reel;
  onClick: () => void;
}

const ReelCard = ({ reel, onClick }: ReelCardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const isInstagramReel = 'source' in reel && reel.source === ReelSource.INSTAGRAM;

  return (
    <div 
      className="reel-card relative rounded-md overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105 hover:shadow-lg"
      onClick={onClick}
    >
      <div className="aspect-square bg-secondary relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-secondary">
            <div className="w-8 h-8 rounded-full bg-instagram-gradient animate-pulse-slow"></div>
          </div>
        )}
        <img 
          src={reel.thumbnailUrl} 
          alt={reel.caption}
          className="w-full h-full object-cover"
          onLoad={() => setIsLoading(false)}
        />
        <div className="reel-overlay absolute inset-0 bg-black bg-opacity-50 opacity-0 transition-opacity duration-200 flex flex-col justify-between p-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-instagram-gradient flex items-center justify-center">
              <span className="text-xs font-bold text-white">{reel.username.charAt(0).toUpperCase()}</span>
            </div>
            <span className="text-white font-medium truncate">{reel.username}</span>
            {isInstagramReel && (
              <Instagram size={16} className="text-white ml-auto" />
            )}
          </div>
          
          <div>
            <p className="text-white text-sm line-clamp-2 mb-2">{reel.caption}</p>
            <div className="flex justify-between text-white text-xs">
              <div className="flex items-center space-x-1">
                <Heart size={14} />
                <span>{formatCompactNumber(reel.likes)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye size={14} />
                <span>{formatCompactNumber(reel.views)}</span>
              </div>
            </div>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-instagram-gradient bg-opacity-80 flex items-center justify-center">
              <Play size={24} className="text-white ml-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelCard;
