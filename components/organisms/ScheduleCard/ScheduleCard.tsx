import React from 'react';
import { Calendar, Clock, MapPin, Users, Eye } from 'lucide-react';
import { Button } from '@/components/atoms/Button/Button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

interface ScheduleCardProps {
  id: string;
  date: string;
  time: string;
  venue: string;
  slotsAvailable: number;
  totalSlots: number;
  fee: number;
  type: string;
  facilities: string[];
  description?: string;
  image?: string;
  onBooking?: (id: string) => void;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  id,
  date,
  time,
  venue,
  slotsAvailable,
  totalSlots,
  fee,
  type,
  facilities,
  description,
  image,
  onBooking
}) => {
  const router = useRouter();

  const handleDetailClick = () => {
    router.push(`/schedule/${id}`);
  };

  const handleBookingClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBooking) {
      onBooking(id);
    }
  };

  const occupancyPercentage = ((totalSlots - slotsAvailable) / totalSlots) * 100;

  return (
    <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-sky-100 overflow-hidden group">
      {/* Image Section */}
      {image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={venue}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute top-3 left-3">
            <Badge
              variant={type === 'Championship' ? 'default' : 'secondary'}
              className={type === 'Championship' ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-white' : 'bg-white/90 text-gray-800'}
            >
              {type}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge className="bg-green-500/90 text-white">
              {slotsAvailable} slots left
            </Badge>
          </div>
        </div>
      )}

      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          {!image && (
            <Badge
              variant={type === 'Championship' ? 'default' : 'secondary'}
              className={type === 'Championship' ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-white' : ''}
            >
              {type}
            </Badge>
          )}
          <span className="text-sm text-gray-500">
            {new Date(date).toLocaleDateString('id-ID', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-sky-700 transition-colors">
            {venue}
          </h3>
          {description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {description}
            </p>
          )}

          <div className="space-y-2">
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">{time} WIB</span>
            </div>

            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-sm">{venue}</span>
            </div>

            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-2" />
              <span className="text-sm">
                {slotsAvailable}/{totalSlots} slot tersisa
              </span>
            </div>
          </div>
        </div>

        {/* Facilities */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Facilities:</p>
          <div className="flex flex-wrap gap-1">
            {facilities.slice(0, 3).map((facility, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {facility}
              </Badge>
            ))}
            {facilities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{facilities.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-bold text-green-600">
            Rp {fee.toLocaleString('id-ID')} / orang
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-sky-400 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${occupancyPercentage}%`
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {Math.round(occupancyPercentage)}% terisi
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDetailClick}
            className="flex-1 hover:bg-sky-50 hover:border-sky-300"
          >
            <Eye className="w-4 h-4 mr-1" />
            Detail
          </Button>
          <Button
            variant="sky"
            size="sm"
            onClick={handleBookingClick}
            disabled={slotsAvailable === 0}
            className="flex-1"
          >
            {slotsAvailable === 0 ? 'Penuh' : 'Book Now'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};