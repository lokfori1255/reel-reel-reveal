
import { useState, useEffect } from "react";
import { InstagramReel } from "../types/reels";

interface InstagramEmbedProps {
  reel: InstagramReel;
  onLoad?: () => void;
}

const InstagramEmbed = ({ reel, onLoad }: InstagramEmbedProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load Instagram embed script if it doesn't exist
    if (!window.instgrm) {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.onload = () => {
        if (window.instgrm) {
          window.instgrm.Embeds.process();
          setIsLoading(false);
          if (onLoad) onLoad();
        }
      };
      document.body.appendChild(script);
    } else {
      // If script already loaded, just process the embeds
      window.instgrm.Embeds.process();
      setIsLoading(false);
      if (onLoad) onLoad();
    }
  }, [onLoad]);

  const embedUrl = `https://www.instagram.com/p/${reel.instagramId}/embed/`;

  return (
    <div className="instagram-embed-container">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary">
          <div className="w-8 h-8 rounded-full bg-instagram-gradient animate-pulse-slow"></div>
        </div>
      )}
      <iframe
        className="w-full aspect-square"
        src={embedUrl}
        frameBorder="0"
        scrolling="no"
        allowTransparency={true}
        onLoad={() => {
          setIsLoading(false);
          if (onLoad) onLoad();
        }}
      ></iframe>
    </div>
  );
};

export default InstagramEmbed;
