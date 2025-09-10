'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, Filter, Search } from 'lucide-react';
import { PageLayout } from '@/components/templates/PageLayout/PageLayout';
import { SearchBar } from '@/components/molecules/SearchBar/SearchBar';
import { Button } from '@/components/atoms/Button/Button';
import { Badge } from '@/components/ui/badge';
import { ScheduleCard } from '@/components/organisms/ScheduleCard/ScheduleCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingScreen } from '@/components/molecules/LoadingScreen/LoadingScreen';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Mock data for schedules
const mockSchedules = [
  {
    id: 1,
    date: '2025-01-15',
    time: '19:00',
    venue: 'Lapangan Futsal Central',
    slotsAvailable: 8,
    totalSlots: 16,
    fee: 75000,
    type: 'Mix',
    facilities: ['Air Mineral', 'Rompi', 'Bola'],
    description: 'Pertandingan mix untuk semua level pemain',
    image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg'
  },
  {
    id: 2,
    date: '2025-01-16',
    time: '20:00',
    venue: 'GOR Senayan Mini Soccer',
    slotsAvailable: 12,
    totalSlots: 16,
    fee: 85000,
    type: 'Open',
    facilities: ['Air Mineral', 'Rompi', 'Bola', 'Shower'],
    description: 'Pertandingan terbuka untuk semua pemain',
    image: 'https://images.pexels.com/photos/1171084/pexels-photo-1171084.jpeg'
  },
  {
    id: 3,
    date: '2025-01-17',
    time: '18:30',
    venue: 'Lapangan Futsal Central',
    slotsAvailable: 3,
    totalSlots: 16,
    fee: 75000,
    type: 'Championship',
    facilities: ['Air Mineral', 'Rompi', 'Bola', 'Wasit'],
    description: 'Pertandingan kompetitif dengan wasit resmi',
    image: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg'
  },
  {
    id: 4,
    date: '2025-01-18',
    time: '19:30',
    venue: 'GOR Senayan Mini Soccer',
    slotsAvailable: 6,
    totalSlots: 16,
    fee: 85000,
    type: 'Open',
    facilities: ['Air Mineral', 'Rompi', 'Bola', 'Shower'],
    description: 'Pertandingan santai untuk bersenang-senang',
    image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg'
  },
  {
    id: 5,
    date: '2025-01-19',
    time: '20:30',
    venue: 'Lapangan Futsal Central',
    slotsAvailable: 10,
    totalSlots: 16,
    fee: 75000,
    type: 'Mix',
    facilities: ['Air Mineral', 'Rompi', 'Bola'],
    description: 'Mix game untuk networking dan bersenang-senang',
    image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg'
  },
  {
    id: 6,
    date: '2025-01-20',
    time: '17:00',
    venue: 'Arena Futsal Jakarta',
    slotsAvailable: 14,
    totalSlots: 16,
    fee: 70000,
    type: 'Open',
    facilities: ['Air Mineral', 'Rompi', 'Bola'],
    description: 'Sore hari yang sempurna untuk bermain futsal',
    image: 'https://images.pexels.com/photos/1171084/pexels-photo-1171084.jpeg'
  }
];

const venues = ['All Venues', 'Lapangan Futsal Central', 'GOR Senayan Mini Soccer', 'Arena Futsal Jakarta'];
const types = ['All Types', 'Mix', 'Open', 'Championship'];

export default function SchedulePage() {
  const [schedules, setSchedules] = useState(mockSchedules);
  const [filteredSchedules, setFilteredSchedules] = useState(mockSchedules);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVenue, setSelectedVenue] = useState('All Venues');
  const [selectedType, setSelectedType] = useState('All Types');
  const [sortBy, setSortBy] = useState('date');
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [bookingType, setBookingType] = useState('individual');
  const [playerCount, setPlayerCount] = useState(1);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = schedules;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(schedule =>
        schedule.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        schedule.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        schedule.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Venue filter
    if (selectedVenue !== 'All Venues') {
      filtered = filtered.filter(schedule => schedule.venue === selectedVenue);
    }

    // Type filter
    if (selectedType !== 'All Types') {
      filtered = filtered.filter(schedule => schedule.type === selectedType);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'venue':
          return a.venue.localeCompare(b.venue);
        case 'fee':
          return a.fee - b.fee;
        case 'availability':
          return b.slotsAvailable - a.slotsAvailable;
        default:
          return 0;
      }
    });

    setFilteredSchedules(filtered);
  }, [schedules, searchQuery, selectedVenue, selectedType, sortBy]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleBooking = (schedule: any) => {
    setSelectedSchedule(schedule);
  };

  if (loading) {
    return <LoadingScreen message="Loading schedules..." />;
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-700 to-blue-700 bg-clip-text text-transparent mb-4">
            Jadwal Pertandingan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Temukan dan daftar untuk pertandingan futsal dan mini soccer yang tersedia. 
            Pilih jadwal yang sesuai dengan waktu dan preferensi Anda.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border border-sky-100">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-sky-400 to-blue-500 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Schedules</p>
                <p className="text-2xl font-bold text-gray-900">{schedules.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md border border-sky-100">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Slots</p>
                <p className="text-2xl font-bold text-gray-900">
                  {schedules.reduce((sum, schedule) => sum + schedule.slotsAvailable, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md border border-sky-100">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Venues</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(schedules.map(s => s.venue)).size}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md border border-sky-100">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">
                  {schedules.filter(s => {
                    const scheduleDate = new Date(s.date);
                    const now = new Date();
                    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                    return scheduleDate >= now && scheduleDate <= weekFromNow;
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md border border-sky-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search by venue, type, or description..."
                onSearch={handleSearch}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="min-w-[160px]">
                <Select value={selectedVenue} onValueChange={setSelectedVenue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select venue" />
                  </SelectTrigger>
                  <SelectContent>
                    {venues.map(venue => (
                      <SelectItem key={venue} value={venue}>{venue}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="min-w-[120px]">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="min-w-[120px]">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="venue">Venue</SelectItem>
                    <SelectItem value="fee">Price</SelectItem>
                    <SelectItem value="availability">Availability</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {searchQuery && (
              <Badge variant="secondary" className="bg-sky-100 text-sky-800">
                Search: {searchQuery}
              </Badge>
            )}
            {selectedVenue !== 'All Venues' && (
              <Badge variant="secondary" className="bg-sky-100 text-sky-800">
                Venue: {selectedVenue}
              </Badge>
            )}
            {selectedType !== 'All Types' && (
              <Badge variant="secondary" className="bg-sky-100 text-sky-800">
                Type: {selectedType}
              </Badge>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredSchedules.length} of {schedules.length} schedules
          </p>
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchedules.map((schedule) => (
            <ScheduleCard
              key={schedule.id}
              id={schedule.id.toString()}
              date={schedule.date}
              time={schedule.time}
              venue={schedule.venue}
              slotsAvailable={schedule.slotsAvailable}
              totalSlots={schedule.totalSlots}
              fee={schedule.fee}
              type={schedule.type}
              facilities={schedule.facilities}
              description={schedule.description}
              image={schedule.image}
              onBooking={handleBooking}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredSchedules.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No schedules found</h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search criteria or filters
            </p>
            <Button
              variant="sky"
              onClick={() => {
                setSearchQuery('');
                setSelectedVenue('All Venues');
                setSelectedType('All Types');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Booking Dialog */}
        <Dialog open={!!selectedSchedule} onOpenChange={() => setSelectedSchedule(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Booking Pertandingan</DialogTitle>
            </DialogHeader>
            {selectedSchedule && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold">{selectedSchedule.venue}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedSchedule.date).toLocaleDateString('id-ID')} - {selectedSchedule.time} WIB
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    Rp {selectedSchedule.fee.toLocaleString('id-ID')} / orang
                  </p>
                </div>

                <Tabs value={bookingType} onValueChange={setBookingType}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="individual">Individual</TabsTrigger>
                    <TabsTrigger value="team">Tim</TabsTrigger>
                  </TabsList>

                  <TabsContent value="individual" className="space-y-4">
                    <div>
                      <Label htmlFor="playerCount">Jumlah Pemain</Label>
                      <Input
                        id="playerCount"
                        type="number"
                        min="1"
                        max="8"
                        value={playerCount}
                        onChange={(e) => setPlayerCount(parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="playerName">Nama Pemain</Label>
                      <Input id="playerName" placeholder="Masukkan nama pemain" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Nomor HP</Label>
                      <Input id="phone" type="tel" placeholder="08xxxxxxxxxx" />
                    </div>
                  </TabsContent>

                  <TabsContent value="team" className="space-y-4">
                    <div>
                      <Label htmlFor="teamName">Nama Tim</Label>
                      <Input id="teamName" placeholder="Masukkan nama tim" />
                    </div>
                    <div>
                      <Label htmlFor="teamSize">Jumlah Pemain</Label>
                      <Input
                        id="teamSize"
                        type="number"
                        min="8"
                        max="16"
                        defaultValue="11"
                      />
                    </div>
                    <div>
                      <Label htmlFor="captain">Kapten Tim</Label>
                      <Input id="captain" placeholder="Nama kapten" />
                    </div>
                    <div>
                      <Label htmlFor="captainPhone">HP Kapten</Label>
                      <Input
                        id="captainPhone"
                        type="tel"
                        placeholder="08xxxxxxxxxx"
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Total Pembayaran</h4>
                  <div className="flex justify-between">
                    <span>
                      {playerCount} Pemain x Rp {selectedSchedule.fee.toLocaleString('id-ID')}
                    </span>
                    <span className="font-bold">
                      Rp {(playerCount * selectedSchedule.fee).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button variant="outline" className="flex-1">
                    Book Tanpa Login
                  </Button>
                  <Button className="flex-1" variant="sky">
                    Konfirmasi Booking
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
}