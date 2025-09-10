import React from 'react';
import { User, Star, MapPin, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Player {
  id: string;
  name: string;
  position: string;
  rating: number;
}

interface LineupCardProps {
  id: string;
  venue: string;
  date: string;
  time: string;
  players: Player[];
  totalSlots: number;
  onViewDetails?: (id: string) => void;
}

export const LineupCard: React.FC<LineupCardProps> = ({
  id,
  venue,
  date,
  time,
  players,
  totalSlots,
  onViewDetails
}) => {
  const positionColors = {
    GK: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    DEF: 'bg-blue-100 text-blue-800 border-blue-200',
    MID: 'bg-green-100 text-green-800 border-green-200',
    ATT: 'bg-red-100 text-red-800 border-red-200'
  };

  const groupedPlayers = players.reduce((acc, player) => {
    if (!acc[player.position]) {
      acc[player.position] = [];
    }
    acc[player.position].push(player);
    return acc;
  }, {} as Record<string, Player[]>);

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-sky-100 group">
      <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-4 border-b border-sky-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-sky-700 transition-colors">
            {venue}
          </h3>
          <Badge variant="outline" className="bg-white">
            {players.length}/{totalSlots} Players
          </Badge>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 space-x-4">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {venue}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {new Date(date).toLocaleDateString('id-ID')} - {time}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {Object.entries(groupedPlayers).map(([position, positionPlayers]) => (
          <div key={position} className="mb-4 last:mb-0">
            <div className="flex items-center mb-2">
              <Badge 
                className={`${positionColors[position as keyof typeof positionColors]} mr-2`}
                variant="outline"
              >
                {position}
              </Badge>
              <span className="text-sm text-gray-500">
                {positionPlayers.length} player{positionPlayers.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {positionPlayers.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50 hover:bg-sky-50 transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-gradient-to-r from-sky-400 to-blue-500 text-white">
                      {player.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {player.name}
                    </p>
                    <div className="flex items-center">
                      <Star className="w-3 h-3 text-yellow-500 mr-1" />
                      <span className="text-xs text-gray-500">{player.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {players.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No players registered yet</p>
          </div>
        )}
        
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(id)}
            className="w-full mt-4 py-2 text-sm font-medium text-sky-700 hover:text-sky-800 hover:bg-sky-50 rounded-lg transition-colors"
          >
            View Full Details
          </button>
        )}
      </div>
    </div>
  );
};