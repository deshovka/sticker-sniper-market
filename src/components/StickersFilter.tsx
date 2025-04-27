
import React from 'react';
import { SkinListing } from '@/utils/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StickersFilterProps {
  listings: SkinListing[];
  selectedSticker: string;
  onStickerChange: (value: string) => void;
}

export const StickersFilter: React.FC<StickersFilterProps> = ({ listings, selectedSticker, onStickerChange }) => {
  const uniqueStickers = React.useMemo(() => {
    const stickers = new Set(listings.map(listing => listing.sticker));
    return Array.from(stickers);
  }, [listings]);

  return (
    <Select value={selectedSticker} onValueChange={onStickerChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a sticker" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">All Stickers</SelectItem>
        {uniqueStickers.map((sticker) => (
          <SelectItem key={sticker} value={sticker}>
            {sticker}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
