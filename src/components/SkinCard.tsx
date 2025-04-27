
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkinListing } from '@/utils/types';
import { cn } from '@/lib/utils';
import { Calendar, Clock } from 'lucide-react';

interface SkinCardProps {
  skin: SkinListing;
  className?: string;
}

export const SkinCard: React.FC<SkinCardProps> = ({ skin, className }) => {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(skin.price);

  const formatTime = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleViewOnSteam = () => {
    window.open(skin.marketLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className={cn("transition-all hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{skin.name}</CardTitle>
        <div className="text-xl font-semibold text-primary">{formattedPrice}</div>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-4">
        <div className="bg-secondary rounded-md p-3">
          <div className="text-sm text-muted-foreground mb-1">Sticker</div>
          <div className="font-medium">{skin.sticker}</div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="text-muted-foreground" size={16} />
            <span className="text-muted-foreground">First seen:</span>
            <span>{formatTime(skin.timestamp)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="text-muted-foreground" size={16} />
            <span className="text-muted-foreground">Updated:</span>
            <span>{formatTime(skin.lastUpdated)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="default"
          className="w-full"
          onClick={handleViewOnSteam}
        >
          View on Steam
        </Button>
      </CardFooter>
    </Card>
  );
};
