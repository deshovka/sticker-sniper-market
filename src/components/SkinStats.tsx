
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SkinListing } from '@/utils/types';

interface SkinStatsProps {
  listings: SkinListing[];
}

export const SkinStats: React.FC<SkinStatsProps> = ({ listings }) => {
  const stats = React.useMemo(() => {
    const totalListings = listings.length;
    const averagePrice = listings.reduce((acc, curr) => acc + curr.price, 0) / totalListings;
    const lowestPrice = Math.min(...listings.map(l => l.price));
    const highestPrice = Math.max(...listings.map(l => l.price));
    
    return {
      totalListings,
      averagePrice,
      lowestPrice,
      highestPrice
    };
  }, [listings]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Total Listings</div>
            <div className="text-2xl font-semibold">{stats.totalListings}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Average Price</div>
            <div className="text-2xl font-semibold">{formatPrice(stats.averagePrice)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Lowest Price</div>
            <div className="text-2xl font-semibold text-green-500">{formatPrice(stats.lowestPrice)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Highest Price</div>
            <div className="text-2xl font-semibold text-red-500">{formatPrice(stats.highestPrice)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
