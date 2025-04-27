
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PriceRangeFilterProps {
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
}

export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
}) => {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
      <div className="flex-1">
        <Label htmlFor="min-price">Min Price ($)</Label>
        <Input
          id="min-price"
          type="number"
          value={minPrice}
          onChange={(e) => onMinPriceChange(e.target.value)}
          placeholder="Min price"
          min="0"
        />
      </div>
      <div className="flex-1">
        <Label htmlFor="max-price">Max Price ($)</Label>
        <Input
          id="max-price"
          type="number"
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(e.target.value)}
          placeholder="Max price"
          min="0"
        />
      </div>
    </div>
  );
};
