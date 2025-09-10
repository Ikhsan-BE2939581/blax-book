'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Share2, Clock } from 'lucide-react';
import { PageLayout } from '@/components/templates/PageLayout/PageLayout';
import { Button } from '@/components/atoms/Button/Button';
import { Badge } from '@/components/ui/badge';
import { LoadingScreen } from '@/components/molecules/LoadingScreen/LoadingScreen';

// Mock data - in real app, this would come from API
const mockNewsData = {
  '1': {
    id: '1',
    title: 'Turnamen Mini Soccer Bulanan - Januari 2025',
    excerpt: 'Pendaftaran turnamen dimulai! Hadiah total 5 juta rupiah untuk juara. Daftarkan tim Anda sekarang dan raih kesempatan menjadi yang terbaik.',
    content: `
      <div class="prose prose-lg max-w-none">
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
        
        <h3>Syarat dan Ketentuan:</h3>
        <ol>
          <li>Tim terdiri dari maksimal 12 pemain</li>
          <li>Usia pemain minimal 17 tahun</li>
          <li>Setiap pemain wajib membawa KTP/identitas</li>
          <li>Biaya pendaftaran sudah termasuk jersey dan konsumsi</li>
        </ol>
        
        <p>Untuk informasi lebih lanjut dan pendaftaran, hubungi kami di nomor yang tertera atau datang langsung ke venue.</p>
      </div>
    `,
    imageUrl: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg',
    category: 'Tournament',
    publishedAt: '2025-01-10T10:00:00Z',
    readTime: '3 min'
  },
  '2': {
    id: '2',
    title: 'Update Harga Sewa Lapangan',
    excerpt: 'Berlaku mulai 1 Februari 2025, ada penyesuaian tarif untuk beberapa venue. Simak detail lengkapnya di sini.',
    content: `
      <div class="prose prose-lg max-w-none">
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
          <li>Maintenance rutin yang lebih intensif</li>
        </ul>
        
        <h3>Fasilitas Baru:</h3>
        <p>Dengan penyesuaian tarif ini, kami juga menambahkan beberapa fasilitas baru:</p>
        <ul>
          <li>Area parkir yang lebih luas</li>
          <li>Kantin dengan menu yang lebih variatif</li>
          <li>WiFi gratis di seluruh area</li>
          <li>Sound system untuk pertandingan</li>
        </ul>
        
        <p>Kami berkomitmen untuk terus memberikan pengalaman bermain terbaik bagi semua member. Terima kasih atas pengertian dan dukungan Anda.</p>
      </div>
    `,
    imageUrl: 'https://images.pexels.com/photos/1171084/pexels-photo-1171084.jpeg',
    category: 'Announcement',
    publishedAt: '2025-01-08T14:30:00Z',
    readTime: '2 min'
  },
  '3': {
    id: '3',
    title: 'Tips Bermain Futsal untuk Pemula',
    excerpt: 'Panduan lengkap untuk pemula yang ingin mulai bermain futsal. Dari teknik dasar hingga strategi tim.',
    content: `
      <div class="prose prose-lg max-w-none">
        <p>Futsal adalah olahraga yang menyenangkan dan mudah dipelajari. Berikut tips untuk pemula yang ingin memulai perjalanan futsal mereka:</p>
        
        <h3>Teknik Dasar:</h3>
        <ul>
          <li><strong>Kontrol bola:</strong> Gunakan bagian dalam kaki untuk kontrol yang lebih baik</li>
          <li><strong>Passing:</strong> Fokus pada akurasi daripada kekuatan</li>
          <li><strong>Dribbling:</strong> Mulai dengan gerakan sederhana</li>
          <li><strong>Shooting:</strong> Latih akurasi tembakan dari berbagai sudut</li>
        </ul>
        
        <h3>Posisi Bermain:</h3>
        <ul>
          <li><strong>Pivot:</strong> Penyerang utama yang bertugas mencetak gol</li>
          <li><strong>Winger:</strong> Pemain sayap yang bergerak cepat</li>
          <li><strong>Defender:</strong> Bek yang menjaga pertahanan</li>
          <li><strong>Goalkeeper:</strong> Penjaga gawang dengan teknik khusus</li>
        </ul>
        
        <h3>Strategi Tim:</h3>
        <p>Dalam futsal, kerjasama tim sangat penting:</p>
        <ul>
          <li>Komunikasi yang baik antar pemain</li>
          <li>Rotasi posisi yang dinamis</li>
          <li>Pressing yang terorganisir</li>
          <li>Transisi cepat dari bertahan ke menyerang</li>
        </ul>
        
        <h3>Tips Latihan:</h3>
        <ol>
          <li>Latihan rutin minimal 2x seminggu</li>
          <li>Fokus pada teknik dasar terlebih dahulu</li>
          <li>Bermain dengan pemain yang lebih berpengalaman</li>
          <li>Tonton pertandingan futsal profesional</li>
          <li>Jaga kondisi fisik dengan cardio dan strength training</li>
        </ol>
        
        <p>Yang terpenting adalah berlatih secara konsisten dan menikmati permainan. Futsal bukan hanya tentang menang atau kalah, tapi juga tentang bersenang-senang dan membangun persahabatan!</p>
      </div>
    `,
    imageUrl: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg',
    category: 'Tips',
    publishedAt: '2025-01-05T09:15:00Z',
    readTime: '5 min'
  }
};

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const articleData = mockNewsData[params.id as keyof typeof mockNewsData];
      setArticle(articleData || null);
      setLoading(false);
    };

    if (params.id) {
      fetchArticle();
    }
  }, [params.id]);

  const handleShare = () => {
    if (navigator.share && article) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href
      });
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading article..." />;
  }

  if (!article) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/news')} variant="sky">
              Back to News
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 hover:bg-sky-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Badge className="bg-sky-100 text-sky-800">
              {article.category}
            </Badge>
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(article.publishedAt).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            {article.readTime && (
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {article.readTime}
              </div>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {article.title}
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        {/* Featured Image */}
        {article.imageUrl && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="mb-8">
          <div 
            dangerouslySetInnerHTML={{ __html: article.content }}
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700"
          />
        </div>

        {/* Share Button */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Published on {new Date(article.publishedAt).toLocaleDateString('id-ID')}
            </div>
            <Button
              variant="outline"
              onClick={handleShare}
              className="hover:bg-sky-50 hover:border-sky-300"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Article
            </Button>
          </div>
        </div>

        {/* Related Articles CTA */}
        <div className="mt-12 text-center">
          <Button
            onClick={() => router.push('/news')}
            variant="sky"
            size="lg"
          >
            Read More Articles
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}