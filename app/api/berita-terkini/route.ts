import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Input validation schema
const newsQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
  category: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['date', 'title', 'category']).optional().default('date'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  status: z.enum(['published', 'draft', 'archived']).optional().default('published'),
});

// Mock data for sports news
const mockNews = [
  {
    id: '1',
    title: 'Turnamen Mini Soccer Bulanan - Januari 2025',
    slug: 'turnamen-mini-soccer-bulanan-januari-2025',
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
      </div>
    `,
    imageUrl: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg',
    category: 'Tournament',
    tags: ['tournament', 'mini soccer', 'hadiah', 'kompetisi'],
    author: {
      id: 'author-1',
      name: 'Admin Sports',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    },
    status: 'published',
    publishedAt: '2025-01-10T10:00:00Z',
    createdAt: '2025-01-09T15:30:00Z',
    updatedAt: '2025-01-10T10:00:00Z',
    readTime: '3 min',
    views: 1250,
    likes: 89,
    featured: true,
  },
  {
    id: '2',
    title: 'Update Harga Sewa Lapangan',
    slug: 'update-harga-sewa-lapangan',
    excerpt: 'Berlaku mulai 1 Februari 2025, ada penyesuaian tarif untuk beberapa venue. Simak detail lengkapnya di sini.',
    content: `
      <div class="prose prose-lg max-w-none">
        <p>Dalam rangka meningkatkan kualitas fasilitas dan pelayanan, kami melakukan penyesuaian tarif sewa lapangan yang akan berlaku mulai 1 Februari 2025.</p>
        
        <h3>Tarif Baru:</h3>
        <ul>
          <li>Lapangan Futsal Central: Rp 80.000/orang (sebelumnya Rp 75.000)</li>
          <li>GOR Senayan Mini Soccer: Rp 90.000/orang (sebelumnya Rp 85.000)</li>
        </ul>
        
        <p>Penyesuaian ini dilakukan untuk peningkatan fasilitas dan kualitas pelayanan yang lebih baik.</p>
      </div>
    `,
    imageUrl: 'https://images.pexels.com/photos/1171084/pexels-photo-1171084.jpeg',
    category: 'Announcement',
    tags: ['harga', 'tarif', 'lapangan', 'announcement'],
    author: {
      id: 'author-2',
      name: 'Manager Venue',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    },
    status: 'published',
    publishedAt: '2025-01-08T14:30:00Z',
    createdAt: '2025-01-07T10:15:00Z',
    updatedAt: '2025-01-08T14:30:00Z',
    readTime: '2 min',
    views: 892,
    likes: 34,
    featured: false,
  },
  {
    id: '3',
    title: 'Tips Bermain Futsal untuk Pemula',
    slug: 'tips-bermain-futsal-untuk-pemula',
    excerpt: 'Panduan lengkap untuk pemula yang ingin mulai bermain futsal. Dari teknik dasar hingga strategi tim yang efektif.',
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
        
        <p>Yang terpenting adalah berlatih secara konsisten dan menikmati permainan!</p>
      </div>
    `,
    imageUrl: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg',
    category: 'Tips',
    tags: ['tips', 'futsal', 'pemula', 'teknik', 'tutorial'],
    author: {
      id: 'author-3',
      name: 'Coach Futsal',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    },
    status: 'published',
    publishedAt: '2025-01-05T09:15:00Z',
    createdAt: '2025-01-04T16:20:00Z',
    updatedAt: '2025-01-05T09:15:00Z',
    readTime: '5 min',
    views: 2156,
    likes: 178,
    featured: true,
  },
  {
    id: '4',
    title: 'Venue Baru: Lapangan Futsal Kemang',
    slug: 'venue-baru-lapangan-futsal-kemang',
    excerpt: 'Kami dengan bangga memperkenalkan venue terbaru kami di kawasan Kemang dengan fasilitas premium dan teknologi terdepan.',
    content: `
      <div class="prose prose-lg max-w-none">
        <p>Setelah melalui proses pembangunan selama 6 bulan, kami dengan bangga memperkenalkan venue terbaru kami di kawasan Kemang, Jakarta Selatan.</p>
        
        <h3>Fasilitas Unggulan:</h3>
        <ul>
          <li>Lapangan dengan rumput sintetis premium FIFA Quality</li>
          <li>Sistem pencahayaan LED full spectrum</li>
          <li>Ruang ganti ber-AC dengan locker individual</li>
          <li>Kantin dengan menu sehat dan bergizi</li>
          <li>Area parkir luas untuk 50 kendaraan</li>
        </ul>
        
        <p>Grand opening akan dilaksanakan pada 20 Januari 2025 dengan berbagai promo menarik!</p>
      </div>
    `,
    imageUrl: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg',
    category: 'News',
    tags: ['venue baru', 'kemang', 'fasilitas', 'grand opening'],
    author: {
      id: 'author-1',
      name: 'Admin Sports',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    },
    status: 'published',
    publishedAt: '2025-01-03T16:45:00Z',
    createdAt: '2025-01-02T11:30:00Z',
    updatedAt: '2025-01-03T16:45:00Z',
    readTime: '4 min',
    views: 756,
    likes: 67,
    featured: false,
  },
  {
    id: '5',
    title: 'Strategi Memenangkan Turnamen Futsal',
    slug: 'strategi-memenangkan-turnamen-futsal',
    excerpt: 'Panduan komprehensif untuk tim yang ingin meraih kemenangan dalam turnamen futsal. Tips dari pelatih berpengalaman.',
    content: `
      <div class="prose prose-lg max-w-none">
        <p>Memenangkan turnamen futsal membutuhkan lebih dari sekadar skill individual. Berikut strategi yang telah terbukti efektif:</p>
        
        <h3>Persiapan Tim:</h3>
        <ul>
          <li>Latihan rutin minimal 3x seminggu</li>
          <li>Analisis video pertandingan lawan</li>
          <li>Kondisi fisik yang prima</li>
          <li>Mental yang kuat dan fokus</li>
        </ul>
        
        <h3>Strategi Bermain:</h3>
        <ul>
          <li>Formasi fleksibel sesuai situasi</li>
          <li>Pressing yang terorganisir</li>
          <li>Transisi cepat dari bertahan ke menyerang</li>
          <li>Set piece yang efektif</li>
        </ul>
        
        <p>Ingat, kerjasama tim adalah kunci utama kesuksesan!</p>
      </div>
    `,
    imageUrl: 'https://images.pexels.com/photos/159698/football-american-football-runner-player-159698.jpeg',
    category: 'Strategy',
    tags: ['strategi', 'turnamen', 'tim', 'taktik', 'kemenangan'],
    author: {
      id: 'author-3',
      name: 'Coach Futsal',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    },
    status: 'published',
    publishedAt: '2025-01-01T12:00:00Z',
    createdAt: '2024-12-30T14:45:00Z',
    updatedAt: '2025-01-01T12:00:00Z',
    readTime: '6 min',
    views: 1834,
    likes: 142,
    featured: true,
  },
];

/**
 * News Service
 * Handles business logic for news operations
 */
class NewsService {
  /**
   * Get filtered and paginated news
   * @param filters - Filter parameters
   * @returns Filtered news with pagination info
   */
  static getNews(filters: any) {
    let filteredNews = [...mockNews];

    // Apply status filter
    filteredNews = filteredNews.filter(
      news => news.status === filters.status
    );

    // Apply category filter
    if (filters.category) {
      filteredNews = filteredNews.filter(
        news => news.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Apply search filter
    if (filters.search) {
      const searchQuery = filters.search.toLowerCase();
      filteredNews = filteredNews.filter(
        news => 
          news.title.toLowerCase().includes(searchQuery) ||
          news.excerpt.toLowerCase().includes(searchQuery) ||
          news.tags.some(tag => tag.toLowerCase().includes(searchQuery)) ||
          news.author.name.toLowerCase().includes(searchQuery)
      );
    }

    // Apply sorting
    filteredNews.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'date':
          comparison = new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }
      
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    // Apply pagination
    const page = parseInt(filters.page);
    const limit = parseInt(filters.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedNews = filteredNews.slice(startIndex, endIndex);
    
    // Get categories for filter options
    const categories = [...new Set(mockNews.map(news => news.category))];
    
    return {
      news: paginatedNews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredNews.length / limit),
        totalItems: filteredNews.length,
        itemsPerPage: limit,
        hasNextPage: endIndex < filteredNews.length,
        hasPreviousPage: page > 1,
      },
      filters: filters,
      categories: categories,
      featured: mockNews.filter(news => news.featured && news.status === 'published').slice(0, 3),
    };
  }

  /**
   * Get single news article by ID
   * @param id - News article ID
   * @returns News article or null
   */
  static getNewsById(id: string) {
    return mockNews.find(news => news.id === id && news.status === 'published') || null;
  }

  /**
   * Get related news articles
   * @param currentId - Current news ID
   * @param category - News category
   * @param limit - Number of related articles
   * @returns Related news articles
   */
  static getRelatedNews(currentId: string, category: string, limit: number = 3) {
    return mockNews
      .filter(news => 
        news.id !== currentId && 
        news.category === category && 
        news.status === 'published'
      )
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  }
}

/**
 * GET /api/berita-terkini
 * Fetch sports news with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Validate query parameters
    const validationResult = newsQuerySchema.safeParse({
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: searchParams.get('sortOrder') || undefined,
      status: searchParams.get('status') || undefined,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid query parameters',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const filters = validationResult.data;
    
    // Get news with filters applied
    const result = NewsService.getNews(filters);

    return NextResponse.json(
      {
        success: true,
        message: 'News retrieved successfully',
        data: result,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}