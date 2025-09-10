"use client";

import { useState } from "react";
import {
  User,
  Trophy,
  Calendar,
  Gift,
  Clock,
  Star,
  Phone,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const gameHistory = [
  {
    id: 1,
    date: "2025-01-10",
    venue: "Lapangan Futsal Central",
    result: "Win",
    goals: 2,
    assists: 1,
  },
  {
    id: 2,
    date: "2025-01-08",
    venue: "GOR Senayan Mini Soccer",
    result: "Loss",
    goals: 0,
    assists: 2,
  },
  {
    id: 3,
    date: "2025-01-05",
    venue: "Lapangan Futsal Central",
    result: "Win",
    goals: 1,
    assists: 0,
  },
];

const vouchers = [
  {
    id: 1,
    title: "50% Off Next Game",
    description: "Berlaku untuk semua venue",
    expires: "2025-02-15",
    used: false,
  },
  {
    id: 2,
    title: "Free Game Voucher",
    description: "Venue: Lapangan Central saja",
    expires: "2025-01-30",
    used: true,
  },
];

export default function UserProfile() {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [userData, setUserData] = useState({
    name: "Ahmad Subagja",
    phone: "08123456789",
    email: "ahmad@example.com",
    joinDate: "2024-06-15",
  });

  const stats = {
    gamesPlayed: 8,
    wins: 5,
    goals: 12,
    assists: 8,
    rating: 4.3,
  };

  const progressToVoucher = (stats.gamesPlayed % 10) * 10;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            </div>
            <Button variant="outline">Kembali ke Beranda</Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl">
                  {userData.name[0]}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {userData.name}
                </h2>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {userData.phone}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Bergabung{" "}
                    {new Date(userData.joinDate).toLocaleDateString("id-ID")}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="font-medium">{stats.rating}</span>
                  </div>
                  <Badge variant="secondary">
                    {stats.gamesPlayed} Games Played
                  </Badge>
                </div>
              </div>

              <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nama Lengkap</Label>
                      <Input
                        id="name"
                        value={userData.name}
                        onChange={(e) =>
                          setUserData({ ...userData, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Nomor HP</Label>
                      <Input
                        id="phone"
                        value={userData.phone}
                        onChange={(e) =>
                          setUserData({ ...userData, phone: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email (Opsional)</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userData.email}
                        onChange={(e) =>
                          setUserData({ ...userData, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowEditDialog(false)}
                      >
                        Batal
                      </Button>
                      <Button onClick={() => setShowEditDialog(false)}>
                        Simpan
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Statistics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.wins}</div>
                  <div className="text-sm text-gray-600">Wins</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <User className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.goals}</div>
                  <div className="text-sm text-gray-600">Goals</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.assists}</div>
                  <div className="text-sm text-gray-600">Assists</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Calendar className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.gamesPlayed}</div>
                  <div className="text-sm text-gray-600">Games</div>
                </CardContent>
              </Card>
            </div>

            {/* Game History */}
            <Card>
              <CardHeader>
                <CardTitle>History Bermain</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gameHistory.map((game) => (
                    <div
                      key={game.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{game.venue}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(game.date).toLocaleDateString("id-ID")}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            game.result === "Win" ? "default" : "destructive"
                          }
                          className="mb-1"
                        >
                          {game.result}
                        </Badge>
                        <div className="text-sm text-gray-600">
                          {game.goals}G, {game.assists}A
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Reward Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="w-5 h-5 mr-2" />
                  Reward Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress ke Voucher</span>
                      <span>{stats.gamesPlayed % 10}/10 games</span>
                    </div>
                    <Progress value={progressToVoucher} className="h-2" />
                  </div>
                  <p className="text-xs text-gray-600">
                    {10 - (stats.gamesPlayed % 10)} game lagi untuk mendapat
                    voucher gratis!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* My Vouchers */}
            <Card>
              <CardHeader>
                <CardTitle>Voucher Saya</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {vouchers.map((voucher) => (
                    <div
                      key={voucher.id}
                      className={`p-3 border rounded-lg ${
                        voucher.used
                          ? "bg-gray-50 opacity-60"
                          : "bg-green-50 border-green-200"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-sm">{voucher.title}</h4>
                        <Badge
                          variant={voucher.used ? "secondary" : "default"}
                          className="text-xs"
                        >
                          {voucher.used ? "Used" : "Active"}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        {voucher.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        Expires:{" "}
                        {new Date(voucher.expires).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Booking Baru
                </Button>
                <Button className="w-full" variant="outline">
                  <Trophy className="w-4 h-4 mr-2" />
                  Lihat Ranking
                </Button>
                <Button className="w-full" variant="outline">
                  <Gift className="w-4 h-4 mr-2" />
                  Tukar Voucher
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
