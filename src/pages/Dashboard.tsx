import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '@/hooks/useWebSocket';
import { SkinCard } from '@/components/SkinCard';
import { ServerStatus as ServerStatusComponent } from '@/components/ServerStatus';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { SkinStats } from '@/components/SkinStats';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [webSocketUrl, setWebSocketUrl] = useState('');
  const [filterSticker, setFilterSticker] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: 'price' | 'name';
    direction: 'asc' | 'desc';
  } | null>(null);

  const {
    connect,
    disconnect,
    isConnected,
    serverStatus,
    listings
  } = useWebSocket();

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    if (auth !== 'true') {
      navigate('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const handleConnect = () => {
    if (!webSocketUrl) {
      toast({
        title: "Error",
        description: "Please enter a WebSocket URL",
        variant: "destructive"
      });
      return;
    }
    connect(webSocketUrl);
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const handleSort = (key: 'price' | 'name') => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredListings = filterSticker
    ? listings.filter(skin => 
        skin.sticker.toLowerCase().includes(filterSticker.toLowerCase()))
    : listings;

  const sortedListings = React.useMemo(() => {
    let result = [...filteredListings];
    
    if (sortConfig) {
      result.sort((a, b) => {
        if (sortConfig.key === 'price') {
          const comparison = a.price - b.price;
          return sortConfig.direction === 'asc' ? comparison : -comparison;
        } else {
          const comparison = a.name.localeCompare(b.name);
          return sortConfig.direction === 'asc' ? comparison : -comparison;
        }
      });
    } else {
      result.sort((a, b) => b.timestamp - a.timestamp);
    }
    
    return result;
  }, [filteredListings, sortConfig]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">CSGO Skin Sniper</h1>
            <p className="text-muted-foreground">Real-time skin listings with stickers</p>
          </div>
          <div className="flex mt-4 md:mt-0">
            <Button variant="outline" className="mr-2" onClick={handleLogout}>Logout</Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>WebSocket Connection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-4 items-center">
              <Input 
                placeholder="WebSocket URL (ws://...)"
                value={webSocketUrl}
                onChange={(e) => setWebSocketUrl(e.target.value)}
                disabled={isConnected}
                className="flex-grow"
              />
              <Button
                onClick={isConnected ? handleDisconnect : handleConnect}
                variant={isConnected ? "destructive" : "default"}
                className="whitespace-nowrap"
              >
                {isConnected ? "Disconnect" : "Connect"}
              </Button>
              <ServerStatusComponent status={serverStatus} />
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <SkinStats listings={sortedListings} />
        </div>

        <div className="mb-6">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">Skin Listings</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1"
                >
                  Name
                  {sortConfig?.key === 'name' && (
                    sortConfig.direction === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSort('price')}
                  className="flex items-center gap-1"
                >
                  Price
                  {sortConfig?.key === 'price' && (
                    sortConfig.direction === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                  )}
                </Button>
              </div>
            </div>
            <div className="w-full md:w-80 mt-4 md:mt-0">
              <Input
                placeholder="Filter by sticker name..."
                value={filterSticker}
                onChange={(e) => setFilterSticker(e.target.value)}
              />
            </div>
          </div>

          {sortedListings.length === 0 ? (
            <div className="bg-secondary p-8 rounded-lg text-center">
              <p className="text-lg text-muted-foreground">
                {isConnected 
                  ? "No skin listings received yet. Waiting for data..."
                  : "Connect to WebSocket to receive skin listings."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedListings.map((skin) => (
                <SkinCard key={`${skin.name}-${skin.timestamp}`} skin={skin} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
