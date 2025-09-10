import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Users,
  Eye,
} from "lucide-react";
import { Button } from "@/components/atoms/Button/Button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  slotsAvailable: number;
  totalSlots: number;
  fee: number;
  type: string;
  facilities?: string[];
  description?: string;
  image?: string;
}

interface MatchCarouselProps {
  matches: Match[];
  className?: string;
}

interface Schedule {
  venue: string;
  date: string;
  fee: number;
  time: string;
}

export const MatchCarousel: React.FC<MatchCarouselProps> = ({
  matches,
  className = "",
}) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [bookingType, setBookingType] = useState("individual");
  const [playerCount, setPlayerCount] = useState(1);

  const itemsPerPage = 2;
  const totalPages = Math.ceil(matches.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + itemsPerPage >= matches.length ? 0 : prevIndex + itemsPerPage
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0
        ? Math.max(0, matches.length - itemsPerPage)
        : Math.max(0, prevIndex - itemsPerPage)
    );
  };

  const handleBooking = (schedule: any) => {
    setSelectedSchedule(schedule);
  };

  const handleDetailClick = (matchId: string) => {
    router.push(`/schedule/${matchId}`);
  };
  const visibleMatches = matches.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  return (
    <div className={`relative ${className}`}>
      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">
          Jadwal Pertandingan
        </h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            disabled={matches.length <= itemsPerPage}
            className="hover:bg-sky-50 hover:border-sky-300"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            disabled={matches.length <= itemsPerPage}
            className="hover:bg-sky-50 hover:border-sky-300"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleMatches.map((match) => (
            <Card
              key={match.id}
              className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-sky-100"
            >
              {/* Image Section */}
              {match.image && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={match.image}
                    alt={match.venue}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-gradient-to-r from-sky-400 to-blue-500 text-white">
                      {match.type}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-green-500/90 text-white">
                      {match.slotsAvailable} slots left
                    </Badge>
                  </div>
                </div>
              )}

              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  {!match.image && (
                    <Badge className="bg-gradient-to-r from-sky-400 to-blue-500 text-white">
                      {match.type}
                    </Badge>
                  )}
                  <span className="text-sm text-gray-500">
                    {new Date(match.date).toLocaleDateString("id-ID", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {match.homeTeam} vs {match.awayTeam}
                  </h3>
                  {match.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {match.description}
                    </p>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{match.venue}</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">{match.time} WIB</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {match.slotsAvailable}/{match.totalSlots} slot tersisa
                      </span>
                    </div>
                  </div>
                </div>

                {/* Facilities */}
                {match.facilities && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Facilities:</p>
                    <div className="flex flex-wrap gap-1">
                      {match.facilities.slice(0, 3).map((facility, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {facility}
                        </Badge>
                      ))}
                      {match.facilities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{match.facilities.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-bold text-green-600">
                    Rp {match.fee.toLocaleString("id-ID")} / orang
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-sky-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          ((match.totalSlots - match.slotsAvailable) /
                            match.totalSlots) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round(
                      ((match.totalSlots - match.slotsAvailable) /
                        match.totalSlots) *
                        100
                    )}
                    % terisi
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDetailClick(match.id)}
                    className="flex-1 hover:bg-sky-50 hover:border-sky-300"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Detail
                  </Button>
                  <Button
                    variant="sky"
                    size="sm"
                    onClick={() => handleBooking(match)}
                    disabled={match.slotsAvailable === 0}
                    className="flex-1 shadow-md hover:shadow-lg"
                  >
                    {match.slotsAvailable === 0 ? "Penuh" : "Book Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * itemsPerPage)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                Math.floor(currentIndex / itemsPerPage) === index
                  ? "bg-sky-500 scale-110"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}

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
    </div>
  );
};
