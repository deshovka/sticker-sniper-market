
import React from 'react';
import { cn } from '@/lib/utils';
import { ServerStatus as ServerStatusType } from '@/utils/types';

interface ServerStatusProps {
  status: ServerStatusType;
  className?: string;
}

export const ServerStatus: React.FC<ServerStatusProps> = ({ status, className }) => {
  const formattedTime = new Date(status.lastUpdated).toLocaleTimeString();
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div 
        className={cn(
          "status-indicator animate-pulse-status", 
          status.online ? "status-online" : "status-offline"
        )} 
      />
      <span className="text-sm">
        Server {status.online ? "Online" : "Offline"} 
        <span className="text-xs text-muted-foreground ml-2">
          Last update: {formattedTime}
        </span>
      </span>
    </div>
  );
};
