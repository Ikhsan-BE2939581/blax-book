'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, Users, Clock, Star, Trophy, Shield } from 'lucide-react';
import { PageLayout } from '@/components/templates/PageLayout/PageLayout';
import { Button } from '@/components/atoms/Button/Button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LoadingScreen } from '@/components/molecules/LoadingScreen/LoadingScreen';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

// Mock data for detailed schedule
const mockDetailedSchedule = {
  '1': {
    id: '1',
    date: '2025-01-15',
    time: '19:00',
    venue: 'Lapangan Futsal Central',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat',
    slotsAvailable: 8,
    totalSlots: 16,
    fee: 75000,
    type: 'Mix',
    description: 'Pertandingan mix untuk semua level pemain. Cocok untuk networking dan bersenang-senang.',
    facilities: ['Air Mineral', 'Rompi', 'Bola', 'Shower', 'Parkir'],
    image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg',
    weather: 'Cerah, 28°C',
    referee: 'Ahmad Referee',
    matchRules: [
      'Durasi pertandingan: 2 x 25 menit',
      'Maksimal 5 pemain per tim di lapangan',
      'Pergantian pemain unlimited',
      'Kartu kuning: 2 menit keluar',
      'Kartu merah: keluar permanen'
    ],
    lineup: {
      teamA: [
        { id: '1', name: 'Ahmad Subagja', position: 'GK', rating: 4.5, avatar: 'AS' },
        { id: '2', name: 'Budi Santoso', position: 'DEF', rating: 4.2, avatar: 'BS' },
        { id: '3', name: 'Charlie Wijaya', position: 'DEF', rating: 4.3, avatar: 'CW' },
        { id: '4', name: 'David Rahman', position: 'MID', rating: 4.7, avatar: 'DR' },
        { id: '5', name: 'Eko Prasetyo', position: 'MID', rating: 4.1, avatar: 'EP' },
        { id: '6', name: 'Fajar Nugroho', position: 'ATT', rating: 4.4, avatar: 'FN' },
        { id: '7', name: 'Gilang Ramadhan', position: 'ATT', rating: 4.6, avatar: 'GR' },
        { id: '8', name: 'Hendra Kusuma', position: 'SUB', rating: 4.3, avatar: 'HK' }
      ],
      teamB: [
        { id: '9', name: 'Indra Gunawan', position: 'GK', rating: 4.5, avatar: 'IG' },
        { id: '10', name: 'Joko Widodo', position: 'DEF', rating: 4.2, avatar: 'JW' },
        { id: '11', name: 'Kevin Sanjaya', position: 'DEF', rating: 4.4, avatar: 'KS' },
        { id: '12', name: 'Lucky Hakim', position: 'MID', rating: 4.6, avatar: 'LH' },
        { id: '13', name: 'Mario Gomez', position: 'MID', rating: 4.3, avatar: 'MG' },
        { id: '14', name: 'Nanda Pratama', position: 'ATT', rating: 4.1, avatar: 'NP' },
        { id: '15', name: 'Oscar Lawalata', position: 'ATT', rating: 4.8, avatar: 'OL' },
        { id: '16', name: 'Putra Nababan', position: 'SUB', rating: 4.2, avatar: 'PN' }
      ]
    }
  },
  '2': {
    id: '2',
    date: '2025-01-16',
    time: '20:00',
    venue: 'GOR Senayan Mini Soccer',
    address: 'Jl. Pintu Satu Senayan, Jakarta Pusat',
    slotsAvailable: 12,
    totalSlots: 16,
    fee: 85000,
    type: 'Open',
    description: 'Pertandingan terbuka untuk semua pemain. Format kompetitif dengan sistem ranking.',
    facilities: ['Air Mineral', 'Rompi', 'Bola', 'Shower', 'Parkir', 'Kantin'],
    image: 'https://images.pexels.com/photos/1171084/pexels-photo-1171084.jpeg',
    weather: 'Berawan, 26°C',
    referee: 'Budi Referee',
    matchRules: [
      'Durasi pertandingan: 2 x 30 menit',
      'Maksimal 6 pemain per tim di lapangan',
      'Pergantian pemain maksimal 5x',
      'Sistem poin: Menang 3, Seri 1, Kalah 0',
      'Extra time jika seri di babak final'
    ],
    lineup: {
      teamA: [
        { id: '17', name: 'Qori Hartono', position: 'GK', rating: 4.4, avatar: 'QH' },
        { id: '18', name: 'Rizki Febrian', position: 'DEF', rating: 4.3, avatar: 'RF' },
        { id: '19', name: 'Sandi Darma', position: 'MID', rating: 4.5, avatar: 'SD' },
        { id: '20', name: 'Toni Kroos', position: 'MID', rating: 4.7, avatar: 'TK' },
        { id: '21', name: 'Umar Sadiq', position: 'ATT', rating: 4.2, avatar: 'US' },
        { id: '22', name: 'Vino Bastian', position: 'ATT', rating: 4.6, avatar: 'VB' }
      ],
      teamB: [
        { id: '23', name: 'Wawan Setiawan', position: 'GK', rating: 4.3, avatar: 'WS' },
        { id: '24', name: 'Xavier Amiruddin', position: 'DEF', rating: 4.4, avatar: 'XA' },
        { id: '25', name: 'Yudi Latif', position: 'MID', rating: 4.5, avatar: 'YL' },
        { id: '26', name: 'Zaki Yamani', position: 'MID', rating: 4.1, avatar: 'ZY' },
        { id: '27', name: 'Arief Rahman', position: 'ATT', rating: 4.8, avatar: 'AR' },
        { id: '28', name: 'Bayu Skak', position: 'ATT', rating: 4.3, avatar: 'BS' }
      ]
    }
  }
};

const positionColors = {
  GK: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  DEF: 'bg-blue-100 text-blue-800 border-blue-200',
  MID: 'bg-green-100 text-green-800 border-green-200',
  ATT: 'bg-red-100 text-red-800 border-red-200',
  SUB: 'bg-gray-100 text-gray-800 border-gray-200'
};

export default function ScheduleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [schedule, setSchedule] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchScheduleDetail = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const scheduleData = mockDetailedSchedule[params.id as keyof typeof mockDetailedSchedule];
      setSchedule(scheduleData || null);
      setLoading(false);
    };

    if (params.id) {
      fetchScheduleDetail();
    }
  }, [params.id]);

  if (loading) {
    return <LoadingScreen message="Loading match details..." />;
  }

  if (!schedule) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Schedule Not Found</h1>
            <p className="text-gray-600 mb-8">The match schedule you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/schedule')} variant="sky">
              Back to Schedule
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const occupancyPercentage = ((schedule.totalSlots - schedule.slotsAvailable) / schedule.totalSlots) * 100;

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 hover:bg-sky-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden mb-8 h-64 md:h-80">
          <img
            src={schedule.image}
            alt={schedule.venue}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center space-x-2 mb-2">
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                {schedule.type}
              </Badge>
              <Badge className="bg-green-500/80 text-white">
                {schedule.slotsAvailable} slots available
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{schedule.venue}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(schedule.date).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {schedule.time} WIB
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {schedule.address}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-sky-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{schedule.totalSlots - schedule.slotsAvailable}/{schedule.totalSlots}</div>
              <div className="text-sm text-gray-600">Players Joined</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">Rp {schedule.fee.toLocaleString('id-ID')}</div>
              <div className="text-sm text-gray-600">Per Person</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{schedule.facilities.length}</div>
              <div className="text-sm text-gray-600">Facilities</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{Math.round(occupancyPercentage)}%</div>
              <div className="text-sm text-gray-600">Occupancy</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="lineup">Live Lineup</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
            <TabsTrigger value="rules">Match Rules</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Match Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">{schedule.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900">Match Details</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Type:</span>
                            <span className="font-medium">{schedule.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Weather:</span>
                            <span className="font-medium">{schedule.weather}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Referee:</span>
                            <span className="font-medium">{schedule.referee}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900">Booking Status</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Available Slots</span>
                            <span className="font-medium">{schedule.slotsAvailable}/{schedule.totalSlots}</span>
                          </div>
                          <Progress value={occupancyPercentage} className="h-2" />
                          <p className="text-xs text-gray-500">
                            {schedule.slotsAvailable} slots remaining
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full" variant="sky" size="lg">
                      Book Now - Rp {schedule.fee.toLocaleString('id-ID')}
                    </Button>
                    <Button className="w-full" variant="outline">
                      Share Match
                    </Button>
                    <Button className="w-full" variant="outline">
                      Add to Calendar
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Venue Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium">{schedule.venue}</p>
                        <p className="text-sm text-gray-600">{schedule.address}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      View on Map
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="lineup" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Team A */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Team A</span>
                    <Badge variant="outline">{schedule.lineup.teamA.length} Players</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {schedule.lineup.teamA.map((player: any) => (
                      <div key={player.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-sky-50 transition-colors">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-r from-sky-400 to-blue-500 text-white text-sm">
                            {player.avatar}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{player.name}</p>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              className={`${positionColors[player.position as keyof typeof positionColors]} text-xs`}
                              variant="outline"
                            >
                              {player.position}
                            </Badge>
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-500 mr-1" />
                              <span className="text-xs text-gray-500">{player.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Team B */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Team B</span>
                    <Badge variant="outline">{schedule.lineup.teamB.length} Players</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {schedule.lineup.teamB.map((player: any) => (
                      <div key={player.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-sky-50 transition-colors">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-sm">
                            {player.avatar}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{player.name}</p>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              className={`${positionColors[player.position as keyof typeof positionColors]} text-xs`}
                              variant="outline"
                            >
                              {player.position}
                            </Badge>
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-500 mr-1" />
                              <span className="text-xs text-gray-500">{player.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lineup Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Lineup Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {schedule.lineup.teamA.filter((p: any) => p.position === 'GK').length + 
                       schedule.lineup.teamB.filter((p: any) => p.position === 'GK').length}
                    </div>
                    <div className="text-sm text-gray-600">Goalkeepers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {schedule.lineup.teamA.filter((p: any) => p.position === 'DEF').length + 
                       schedule.lineup.teamB.filter((p: any) => p.position === 'DEF').length}
                    </div>
                    <div className="text-sm text-gray-600">Defenders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {schedule.lineup.teamA.filter((p: any) => p.position === 'MID').length + 
                       schedule.lineup.teamB.filter((p: any) => p.position === 'MID').length}
                    </div>
                    <div className="text-sm text-gray-600">Midfielders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {schedule.lineup.teamA.filter((p: any) => p.position === 'ATT').length + 
                       schedule.lineup.teamB.filter((p: any) => p.position === 'ATT').length}
                    </div>
                    <div className="text-sm text-gray-600">Attackers</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="facilities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Facilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {schedule.facilities.map((facility: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-800">{facility}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Match Rules & Regulations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {schedule.matchRules.map((rule: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 flex-1">{rule}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}