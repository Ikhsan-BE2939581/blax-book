"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  MapPin,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

const mockSchedules = [
  {
    id: 1,
    date: "2025-01-15",
    time: "19:00",
    venue: "Lapangan Futsal Central",
    booked: 8,
    total: 16,
    revenue: 600000,
    status: "active",
  },
  {
    id: 2,
    date: "2025-01-16",
    time: "20:00",
    venue: "GOR Senayan Mini Soccer",
    booked: 12,
    total: 16,
    revenue: 1020000,
    status: "active",
  },
];

const mockUsers = [
  {
    id: 1,
    name: "Ahmad Subagja",
    phone: "08123456789",
    gamesPlayed: 8,
    lastPlay: "2025-01-10",
    vouchers: 0,
  },
  {
    id: 2,
    name: "Budi Santoso",
    phone: "08187654321",
    gamesPlayed: 12,
    lastPlay: "2025-01-12",
    vouchers: 1,
  },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showNewsDialog, setShowNewsDialog] = useState(false);

  useEffect(() => {
    // Check if admin is authenticated
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
      const adminData = localStorage.getItem("adminUser");
      
      if (!isLoggedIn) {
        toast({
          title: "Access Denied",
          description: "Please login to access the admin dashboard",
          variant: "destructive",
        });
        router.push("/a/login");
        return;
      }
      
      setIsAuthenticated(true);
      if (adminData) {
        setCurrentAdmin(JSON.parse(adminData));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminUser");
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    
    router.push("/a/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push("/")}>
                <Eye className="w-4 h-4 mr-2" />
                Lihat Website
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {currentAdmin?.name || 'Administrator'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Booking
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                +12% dari bulan lalu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp 15.2M</div>
              <p className="text-xs text-muted-foreground">
                +8% dari bulan lalu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">
                +5% dari bulan lalu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Occupancy Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">
                +3% dari bulan lalu
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schedules">Jadwal</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="news">Berita</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Terbaru</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockSchedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{schedule.venue}</div>
                          <div className="text-sm text-gray-500">
                            {schedule.date} - {schedule.time}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {schedule.booked}/{schedule.total}
                          </div>
                          <div className="text-sm text-green-600">
                            Rp {schedule.revenue.toLocaleString("id-ID")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">
                        Chart akan ditampilkan di sini
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schedules" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Management Jadwal</h2>
              <Dialog
                open={showScheduleDialog}
                onOpenChange={setShowScheduleDialog}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Jadwal
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Tambah Jadwal Baru</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date">Tanggal</Label>
                        <Input id="date" type="date" />
                      </div>
                      <div>
                        <Label htmlFor="time">Waktu</Label>
                        <Input id="time" type="time" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="venue">Venue</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih venue" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="central">
                            Lapangan Futsal Central
                          </SelectItem>
                          <SelectItem value="senayan">
                            GOR Senayan Mini Soccer
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="slots">Total Slot</Label>
                        <Input id="slots" type="number" defaultValue="16" />
                      </div>
                      <div>
                        <Label htmlFor="fee">Fee per Orang</Label>
                        <Input id="fee" type="number" placeholder="75000" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="type">Tipe Pertandingan</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tipe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="mix">Mix</SelectItem>
                          <SelectItem value="championship">
                            Championship
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="facilities">Fasilitas</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {[
                          "Air Mineral",
                          "Rompi",
                          "Bola",
                          "Shower",
                          "Wasit",
                        ].map((facility) => (
                          <label
                            key={facility}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              defaultChecked={[
                                "Air Mineral",
                                "Rompi",
                                "Bola",
                              ].includes(facility)}
                            />
                            <span className="text-sm">{facility}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowScheduleDialog(false)}
                      >
                        Batal
                      </Button>
                      <Button>Simpan Jadwal</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal & Waktu</TableHead>
                      <TableHead>Venue</TableHead>
                      <TableHead>Booking</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSchedules.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{schedule.date}</div>
                            <div className="text-sm text-gray-500">
                              {schedule.time} WIB
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{schedule.venue}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="text-sm">
                              {schedule.booked}/{schedule.total}
                            </div>
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{
                                  width: `${
                                    (schedule.booked / schedule.total) * 100
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          Rp {schedule.revenue.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              schedule.status === "active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {schedule.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Management Users</h2>
              <div className="flex space-x-2">
                <Input placeholder="Search users..." className="w-64" />
                <Button variant="outline">Export</Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>No. HP</TableHead>
                      <TableHead>Games Played</TableHead>
                      <TableHead>Last Play</TableHead>
                      <TableHead>Vouchers</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>{user.gamesPlayed}</span>
                            {user.gamesPlayed >= 10 && (
                              <Badge variant="outline" className="text-xs">
                                Eligible for voucher
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{user.lastPlay}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.vouchers > 0 ? "default" : "secondary"
                            }
                          >
                            {user.vouchers}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Management Berita</h2>
              <Dialog open={showNewsDialog} onOpenChange={setShowNewsDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Berita
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Berita Baru</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Judul Berita</Label>
                      <Input id="title" placeholder="Masukkan judul berita" />
                    </div>
                    <div>
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        placeholder="Ringkasan singkat berita"
                      />
                    </div>
                    <div>
                      <Label htmlFor="content">Konten</Label>
                      <Textarea
                        id="content"
                        rows={6}
                        placeholder="Isi lengkap berita"
                      />
                    </div>
                    <div>
                      <Label htmlFor="image">URL Gambar</Label>
                      <Input id="image" placeholder="https://..." />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowNewsDialog(false)}
                      >
                        Batal
                      </Button>
                      <Button>Publish</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-4">
                  <img
                    src="https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg"
                    alt="News"
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-semibold mb-2">
                    Turnamen Mini Soccer Bulanan
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Pendaftaran turnamen dimulai! Hadiah total 5 juta rupiah
                    untuk juara.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">2025-01-10</span>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold">Pengaturan Sistem</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pengaturan Umum</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="booking-notification">
                      Notifikasi Booking
                    </Label>
                    <Switch id="booking-notification" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-confirm">Auto Confirm Payment</Label>
                    <Switch id="auto-confirm" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="guest-booking">Allow Guest Booking</Label>
                    <Switch id="guest-booking" defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Reward Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="voucher-threshold">
                      Games untuk Voucher
                    </Label>
                    <Input
                      id="voucher-threshold"
                      type="number"
                      defaultValue="10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="voucher-value">Nilai Voucher (%)</Label>
                    <Input id="voucher-value" type="number" defaultValue="50" />
                  </div>
                  <div>
                    <Label htmlFor="max-vouchers">Max Vouchers per User</Label>
                    <Input id="max-vouchers" type="number" defaultValue="3" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
