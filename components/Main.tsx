import { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Star,
  Menu,
  Phone,
  User,
} from "lucide-react";
import { Button } from "@/components/atoms/Button/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { MatchCarousel } from "@/components/organisms/MatchCarousel/MatchCarousel";
import { NewsSection } from "@/components/organisms/NewsSection/NewsSection";

type Schedule = {
  venue: string;
  date: string;
  fee: number;
  time: string;
};

const schedules = [
  {
    id: 1,
    date: "2025-01-15",
    time: "19:00",
    venue: "Lapangan Futsal Central",
    slotsAvailable: 8,
    totalSlots: 16,
    fee: 75000,
    type: "Mix",
    facilities: ["Air Mineral", "Rompi", "Bola"],
  },
  {
    id: 2,
    date: "2025-01-16",
    time: "20:00",
    venue: "GOR Senayan Mini Soccer",
    slotsAvailable: 12,
    totalSlots: 16,
    fee: 85000,
    type: "Open",
    facilities: ["Air Mineral", "Rompi", "Bola", "Shower"],
  },
  {
    id: 3,
    date: "2025-01-17",
    time: "18:30",
    venue: "Lapangan Futsal Central",
    slotsAvailable: 3,
    totalSlots: 16,
    fee: 75000,
    type: "Championship",
    facilities: ["Air Mineral", "Rompi", "Bola", "Wasit"],
  },
  {
    id: 4,
    date: "2025-01-18",
    time: "19:30",
    venue: "GOR Senayan Mini Soccer",
    slotsAvailable: 6,
    totalSlots: 16,
    fee: 85000,
    type: "Open",
    facilities: ["Air Mineral", "Rompi", "Bola", "Shower"],
  },
  {
    id: 5,
    date: "2025-01-19",
    time: "20:30",
    venue: "Lapangan Futsal Central",
    slotsAvailable: 10,
    totalSlots: 16,
    fee: 75000,
    type: "Mix",
    facilities: ["Air Mineral", "Rompi", "Bola"],
  },
];

const news = [
  {
    id: "1",
    title: "Turnamen Mini Soccer Bulanan - Januari 2025",
    description:
      "Pendaftaran turnamen dimulai! Hadiah total 5 juta rupiah untuk juara. Daftarkan tim Anda sekarang dan raih kesempatan menjadi yang terbaik.",
    date: "2025-01-10",
    thumbnail:
      "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg",
    readTime: "3 min",
  },
  {
    id: "2",
    title: "Update Harga Sewa Lapangan",
    description:
      "Berlaku mulai 1 Februari 2025, ada penyesuaian tarif untuk beberapa venue. Simak detail lengkapnya di sini.",
    date: "2025-01-08",
    thumbnail:
      "https://images.pexels.com/photos/1171084/pexels-photo-1171084.jpeg",
    readTime: "2 min",
  },
  {
    id: "3",
    title: "Tips Bermain Futsal untuk Pemula",
    description:
      "Panduan lengkap untuk pemula yang ingin mulai bermain futsal. Dari teknik dasar hingga strategi tim yang efektif.",
    date: "2025-01-05",
    thumbnail:
      "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg",
    readTime: "5 min",
  },
];

// Transform schedules data for carousel
const matchesData = schedules.map((schedule) => ({
  id: schedule.id.toString(),
  homeTeam: "Team A",
  awayTeam: "Team B",
  date: schedule.date,
  time: schedule.time,
  venue: schedule.venue,
  slotsAvailable: schedule.slotsAvailable,
  totalSlots: schedule.totalSlots,
  fee: schedule.fee,
  type: schedule.type,
  facilities: schedule.facilities,
  description: `Pertandingan ${schedule.type.toLowerCase()} untuk semua level pemain`,
  image: schedule.id === 1 ? 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg' : 
         schedule.id === 2 ? 'https://images.pexels.com/photos/1171084/pexels-photo-1171084.jpeg' :
         'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg'
}));

const players = [
  { name: "Ahmad", position: "GK", rating: 4.5 },
  { name: "Budi", position: "DEF", rating: 4.2 },
  { name: "Charlie", position: "MID", rating: 4.7 },
  { name: "David", position: "ATT", rating: 4.3 },
];

export default function MainContent() {
  const router = useRouter();
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [bookingType, setBookingType] = useState("individual");
  const [playerCount, setPlayerCount] = useState(1);

  const handleBooking = (schedule: any) => {
    setSelectedSchedule(schedule);
  };

  return (
    <>
      <div id="#match" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Match Carousel */}
        <MatchCarousel matches={matchesData} />
        {/* News Section */}
        <NewsSection newsItems={news} className="mb-16" />
      </div>

      <Dialog
        open={!!selectedSchedule}
        onOpenChange={() => setSelectedSchedule(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Pertandingan</DialogTitle>
          </DialogHeader>
          {selectedSchedule && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold">{selectedSchedule.venue}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(selectedSchedule.date).toLocaleDateString("id-ID")}{" "}
                  - {selectedSchedule.time} WIB
                </p>
                <p className="text-lg font-bold text-green-600">
                  Rp {selectedSchedule.fee.toLocaleString("id-ID")} / orang
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
                    {playerCount} Pemain x Rp{" "}
                    {selectedSchedule.fee.toLocaleString("id-ID")}
                  </span>
                  <span className="font-bold">
                    Rp{" "}
                    {(playerCount * selectedSchedule.fee).toLocaleString(
                      "id-ID"
                    )}
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
    </>
  );
}
