"use client";

import { useState, useEffect } from "react";
import { Newspaper, Filter, Calendar, Share2 } from "lucide-react";
import { PageLayout } from "@/components/templates/PageLayout/PageLayout";
import { SearchBar } from "@/components/molecules/SearchBar/SearchBar";
import { NewsCard } from "@/components/organisms/NewsCard/NewsCard";
import { Button } from "@/components/atoms/Button/Button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingScreen } from "@/components/molecules/LoadingScreen/LoadingScreen";

// Mock data - in real app, this would come from API
const mockNews = [
  {
    id: "1",
    title: "Turnamen Mini Soccer Bulanan - Januari 2025",
    excerpt:
      "Pendaftaran turnamen dimulai! Hadiah total 5 juta rupiah untuk juara. Daftarkan tim Anda sekarang dan raih kesempatan menjadi yang terbaik.",
    content: `
      <p>Turnamen Mini Soccer Bulanan kembali hadir dengan hadiah yang lebih menarik! Bulan Januari 2025 ini, kami menghadirkan kompetisi yang lebih seru dengan total hadiah 5 juta rupiah.</p>
      
      <h3>Detail Turnamen:</h3>
      <ul>
        <li>Tanggal: 25-26 Januari 2025</li>
        <li>Venue: GOR Senayan Mini Soccer</li>
        <li>Format: 7 vs 7</li>
        <li>Biaya pendaftaran: Rp 500.000 per tim</li>
      </ul>
      
      <h3>Hadiah:</h3>
      <ul>
        <li>Juara 1: Rp 2.500.000 + Trophy</li>
        <li>Juara 2: Rp 1.500.000 + Trophy</li>
        <li>Juara 3: Rp 1.000.000 + Trophy</li>
      </ul>
      
      <p>Pendaftaran dibuka hingga 20 Januari 2025. Jangan sampai terlewat!</p>
    `,
    imageUrl:
      "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg",
    category: "Tournament",
    publishedAt: "2025-01-10T10:00:00Z",
  },
  {
    id: "2",
    title: "Update Harga Sewa Lapangan",
    excerpt:
      "Berlaku mulai 1 Februari 2025, ada penyesuaian tarif untuk beberapa venue. Simak detail lengkapnya di sini.",
    content: `
      <p>Dalam rangka meningkatkan kualitas fasilitas dan pelayanan, kami melakukan penyesuaian tarif sewa lapangan yang akan berlaku mulai 1 Februari 2025.</p>
      
      <h3>Tarif Baru:</h3>
      <ul>
        <li>Lapangan Futsal Central: Rp 80.000/orang (sebelumnya Rp 75.000)</li>
        <li>GOR Senayan Mini Soccer: Rp 90.000/orang (sebelumnya Rp 85.000)</li>
      </ul>
      
      <p>Penyesuaian ini dilakukan untuk:</p>
      <ul>
        <li>Peningkatan kualitas rumput sintetis</li>
        <li>Penambahan fasilitas shower dan locker</li>
        <li>Peningkatan sistem pencahayaan LED</li>
      </ul>
    `,
    imageUrl:
      "https://images.pexels.com/photos/1171084/pexels-photo-1171084.jpeg",
    category: "Announcement",
    publishedAt: "2025-01-08T14:30:00Z",
  },
  {
    id: "3",
    title: "Tips Bermain Futsal untuk Pemula",
    excerpt:
      "Panduan lengkap untuk pemula yang ingin mulai bermain futsal. Dari teknik dasar hingga strategi tim.",
    content: `
      <p>Futsal adalah olahraga yang menyenangkan dan mudah dipelajari. Berikut tips untuk pemula:</p>
      
      <h3>Teknik Dasar:</h3>
      <ul>
        <li>Kontrol bola dengan bagian dalam kaki</li>
        <li>Passing pendek dan akurat</li>
        <li>Dribbling sederhana</li>
      </ul>
      
      <h3>Posisi Bermain:</h3>
      <ul>
        <li>Pivot: Penyerang utama</li>
        <li>Winger: Pemain sayap</li>
        <li>Defender: Bek</li>
        <li>Goalkeeper: Penjaga gawang</li>
      </ul>
      
      <p>Yang terpenting adalah berlatih secara konsisten dan menikmati permainan!</p>
    `,
    imageUrl:
      "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg",
    category: "Tips",
    publishedAt: "2025-01-05T09:15:00Z",
  },
  {
    id: "4",
    title: "Venue Baru: Lapangan Futsal Kemang",
    excerpt:
      "Kami dengan bangga memperkenalkan venue terbaru kami di kawasan Kemang dengan fasilitas premium.",
    imageUrl:
      "https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg",
    category: "News",
    publishedAt: "2025-01-03T16:45:00Z",
  },
];

const categories = [
  "All Categories",
  "Tournament",
  "Announcement",
  "Tips",
  "News",
];

export default function NewsPage() {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState(mockNews);
  const [filteredNews, setFilteredNews] = useState(mockNews);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    let filtered = news;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(
        (article) => article.category === selectedCategory
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.publishedAt).getTime() -
            new Date(b.publishedAt).getTime()
          );
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredNews(filtered);
  }, [news, searchQuery, selectedCategory, sortBy]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleShare = (id: string) => {
    const article = news.find((n) => n.id === id);
    if (article && navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: `${window.location.origin}/news/${id}`,
      });
    }
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen message="Loading news..." />;
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-700 to-blue-700 bg-clip-text text-transparent mb-4">
            Latest News & Updates
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest news, tournaments, and announcements
            from our football community.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border border-sky-100">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-sky-400 to-blue-500 rounded-lg">
                <Newspaper className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Articles
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {news.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-sky-100">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    news.filter(
                      (n) =>
                        new Date(n.publishedAt).getMonth() ===
                        new Date().getMonth()
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-sky-100">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg">
                <Share2 className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(news.map((n) => n.category)).size}
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
                placeholder="Search articles..."
                onSearch={handleSearch}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="min-w-[160px]">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
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
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
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
            {selectedCategory !== "All Categories" && (
              <Badge variant="secondary" className="bg-sky-100 text-sky-800">
                Category: {selectedCategory}
              </Badge>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredNews.length} of {news.length} articles
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((article) => (
            <NewsCard
              key={article.id}
              id={article.id}
              title={article.title}
              excerpt={article.excerpt}
              content={article.content}
              imageUrl={article.imageUrl}
              category={article.category}
              publishedAt={article.publishedAt}
              onShare={handleShare}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <Newspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No articles found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search criteria or filters
            </p>
            <Button
              variant="sky"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All Categories");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
