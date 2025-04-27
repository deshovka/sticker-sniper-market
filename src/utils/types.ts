
export interface SkinListing {
  id: string;
  name: string;
  sticker: string;
  price: number;
  marketLink: string;
  timestamp: number;
  lastUpdated: number;
  imageUrl?: string;
}

export interface ServerStatus {
  online: boolean;
  lastUpdated: number;
}

export interface WebSocketMessage {
  type: 'update' | 'status' | 'error';
  data: SkinListing | ServerStatus | string;
}
