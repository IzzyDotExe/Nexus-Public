'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Typography } from "@/lib/common/atoms/typography";
import { useTextContent } from "@/lib/hooks/useTextContent";
import { Heart, ExternalLink } from "lucide-react";
import { ReactNode, useState } from "react";

interface CauseCardProps {
  titleKey: string;
  descriptionKey: string;
  buttonTextKey: string;
  buttonLinkKey: string;
  descriptionExtra?: ReactNode;
}

interface FlyingHeart {
  id: number;
  x: number;
  y: number;
  yStart: number;
  rotation: number;
  delay: number;
}

export function CauseCard({
  titleKey,
  descriptionKey,
  buttonTextKey,
  buttonLinkKey,
  descriptionExtra
}: CauseCardProps) {
  const { getText } = useTextContent();
  const [isFilled, setIsFilled] = useState(false);
  const [flyingHearts, setFlyingHearts] = useState<FlyingHeart[]>([]);

  const handleHeartClick = () => {
    setIsFilled(!isFilled);
    
    if (!isFilled) {
      // Create 6-8 flying hearts with random directions
      const newHearts: FlyingHeart[] = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 200 - 100, // -100 to 100
        y: Math.random() * -150 - 50, // -50 to -200 (upward)
        yStart: Math.random() * 10,
        rotation: Math.random() * 360,
        delay: i * 50, // Stagger the animation
      }));

      setFlyingHearts(newHearts);

      // Clean up after animation
      setTimeout(() => {
        setFlyingHearts([]);
      }, 1500);
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg hover:scale-105 transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="relative">
          <Heart 
            className={`h-8 w-8 shrink-0 mt-1 cursor-pointer transition-all duration-300 ${
              isFilled 
                ? 'fill-red-500 text-red-500 scale-110' 
                : 'text-accent hover:scale-110'
            }`}
            onClick={handleHeartClick}
          />
          
          {/* Flying hearts */}
          {flyingHearts.map((heart) => (
            <Heart
              key={heart.id}
              className={`absolute top-3 left-2 h-4 w-4 fill-red-500 text-red-500 pointer-events-none`}
              style={{
                animation: `flyOut 1.5s ease-out forwards`,
                animationDelay: `${heart.delay}ms`,
                '--fly-x': `${heart.x}px`,
                '--fly-y': `${heart.y}px`,
                '--rotate': `${heart.rotation}deg`,
              } as React.CSSProperties & { [key: string]: string }}
            />
          ))}
        </div>
        
        <div className="grow">
          <Typography textKey={titleKey} as="h3" className="text-xl font-bold mb-2" />
          <Typography textKey={descriptionKey} as="p" className="text-muted-foreground mb-4">
            {descriptionExtra}
          </Typography>
          <Button asChild className="w-full">
            <a href={getText(buttonLinkKey)} target="_blank" rel="noopener noreferrer">
              <Typography textKey={buttonTextKey} />
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes flyOut {
          0% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--fly-x), var(--fly-y)) rotate(var(--rotate)) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
    </Card>
  );
}
