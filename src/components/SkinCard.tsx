
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkinListing } from '@/utils/types';
import { cn } from '@/lib/utils';

interface SkinCardProps {
  skin: SkinListing;
  className?: string;
}

export const SkinCard: React.FC<SkinCardProps> = ({ skin, className }) => {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(skin.price);

  const timeSince = (): string => {
    const seconds = Math.floor((Date.now() - skin.timestamp) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleOpenMarketLink = () => {
    window.open(skin.marketLink, '_blank');
  };

  return (
    <Card className={cn("w-full transition-all", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{skin.name}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="bg-secondary rounded-md p-3 mb-3">
          <div className="text-sm text-muted-foreground mb-1">Sticker</div>
          <div className="font-medium">{skin.sticker}</div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-muted-foreground">Price</div>
            <div className="text-xl font-semibold text-primary">{formattedPrice}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Updated</div>
            <div className="text-sm">{timeSince()}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleOpenMarketLink}
        >
          View on Market
        </Button>
      </CardFooter>
    </Card>
  );
};
