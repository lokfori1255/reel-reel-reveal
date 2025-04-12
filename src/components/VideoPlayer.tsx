
import { useRef, useEffect, useState } from "react";
import { Reel, ReelSource, InstagramReel } from "../types/reels";
import { X, Play, Pause, Volume2, VolumeX, Heart, Share2, Instagram, Download } from "lucide-react";
import { formatCompactNumber } from "../utils/formatNumber";
import InstagramEmbed from "./InstagramEmbed";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

interface VideoPlayerProps {
  reel: Reel;
  onClose: () => void;
}

const VideoPlayer = ({ reel, onClose }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();
  
  const isInstagramReel = 'source' in reel && reel.source === ReelSource.INSTAGRAM;

  useEffect(() => {
    if (isInstagramReel) return;
    
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsLoading(false);
      video.play().catch(() => {
        // Autoplay was prevented, show play button
        setIsPlaying(false);
      });
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("playing", () => setIsPlaying(true));
    video.addEventListener("pause", () => setIsPlaying(false));

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("playing", () => setIsPlaying(true));
      video.removeEventListener("pause", () => setIsPlaying(false));
    };
  }, [reel, isInstagramReel]);

  const togglePlay = () => {
    if (isInstagramReel || !videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(error => {
        console.error("Error playing video:", error);
      });
    }
  };

  const toggleMute = () => {
    if (isInstagramReel || !videoRef.current) return;
    
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      toast({
        title: "Liked!",
        description: `You liked @${reel.username}'s reel`,
      });
    }
  };

  const handleShare = () => {
    if (navigator.share && !isInstagramReel) {
      navigator.share({
        title: `Reel by ${reel.username}`,
        text: reel.caption,
        url: window.location.href,
      }).catch((error) => {
        console.error("Error sharing:", error);
        copyToClipboard();
      });
    } else if (isInstagramReel) {
      // For Instagram reels, open the Instagram URL
      window.open((reel as InstagramReel).instagramUrl, "_blank");
    } else {
      copyToClipboard();
    }
  };
  
  const copyToClipboard = () => {
    const shareText = `Check out this reel by ${reel.username}: ${reel.caption}`;
    navigator.clipboard.writeText(shareText);
    toast({
      title: "Link copied!",
      description: "Reel link copied to clipboard",
    });
  };

  const handleDownload = () => {
    if (isInstagramReel) {
      toast({
        title: "Instagram Reel",
        description: "Visit Instagram to download this reel",
        variant: "destructive",
      });
      return;
    }
    
    const a = document.createElement("a");
    a.href = reel.videoUrl;
    a.download = `reel-${reel.id}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Download started",
      description: "Reel is being downloaded",
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-lg mx-auto">
        <button 
          className="absolute right-4 top-4 z-10 text-white bg-black bg-opacity-50 rounded-full p-2"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        
        <div className="video-container rounded-lg overflow-hidden">
          {isInstagramReel ? (
            <InstagramEmbed 
              reel={reel as InstagramReel} 
              onLoad={() => setIsLoading(false)} 
            />
          ) : (
            <>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-instagram-gradient animate-pulse-slow"></div>
                </div>
              )}
              
              <video
                ref={videoRef}
                src={reel.videoUrl}
                loop
                playsInline
                muted={isMuted}
                className="w-full h-full object-contain"
              />
            </>
          )}
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-instagram-gradient flex items-center justify-center">
                <span className="text-xs font-bold text-white">{reel.username.charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-white font-medium">{reel.username}</span>
              {isInstagramReel && (
                <Instagram size={16} className="text-white ml-2" />
              )}
            </div>
            
            {!isInstagramReel && (
              <div className="flex space-x-4">
                <button 
                  className="text-white bg-black bg-opacity-50 rounded-full p-2"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                
                <button 
                  className="text-white bg-black bg-opacity-50 rounded-full p-2"
                  onClick={toggleMute}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
              </div>
            )}
          </div>
          
          <p className="text-white text-sm mb-2">{reel.caption}</p>
          
          <div className="flex justify-between text-white mt-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLike} 
              className={`text-white hover:bg-white/10 ${isLiked ? 'text-instagram-red' : ''}`}
            >
              <Heart size={20} className={isLiked ? "fill-instagram-red text-instagram-red" : ""} />
              <span>{formatCompactNumber(isLiked ? reel.likes + 1 : reel.likes)}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleShare}
              className="text-white hover:bg-white/10"
            >
              <Share2 size={20} />
              <span>Share</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDownload}
              className="text-white hover:bg-white/10"
            >
              <Download size={20} />
              <span>Download</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
