import { AuthService } from './authService';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  details?: any[];
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ScheduleFilters {
  page?: number;
  limit?: number;
  date?: string;
  team?: string;
  league?: string;
  venue?: string;
  type?: string;
  sortBy?: 'date' | 'venue' | 'fee' | 'availability';
  sortOrder?: 'asc' | 'desc';
}

export interface NewsFilters {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: 'date' | 'title' | 'category';
  sortOrder?: 'asc' | 'desc';
  status?: 'published' | 'draft' | 'archived';
}

export interface Schedule {
  id: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  slotsAvailable: number;
  totalSlots: number;
  fee: number;
  type: string;
  facilities: string[];
  description: string;
  image: string;
  weather: string;
  referee: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: string;
  tags: string[];
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  status: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  readTime: string;
  views: number;
  likes: number;
  featured: boolean;
}

/**
 * API Service Class
 * Centralized service for making API calls with authentication and error handling
 */
export class ApiService {
  private static readonly BASE_URL = '/api';

  /**
   * Make authenticated API request with automatic error handling
   * @param endpoint - API endpoint
   * @param options - Fetch options
   * @returns Promise with API response
   */
  private static async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.BASE_URL}${endpoint}`;
      const response = await AuthService.authenticatedFetch(url, options);
      return response;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      
      if (error instanceof Error) {
        return {
          success: false,
          message: 'Request failed',
          error: error.message,
        };
      }
      
      return {
        success: false,
        message: 'Request failed',
        error: 'An unexpected error occurred',
      };
    }
  }

  /**
   * Build query string from parameters
   * @param params - Query parameters object
   * @returns Query string
   */
  private static buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  /**
   * Fetch sports schedules with filtering and pagination
   * @param filters - Schedule filter parameters
   * @returns Promise with schedules data
   */
  static async getSchedules(filters: ScheduleFilters = {}): Promise<ApiResponse<{
    schedules: Schedule[];
    pagination: PaginationInfo;
    filters: ScheduleFilters;
  }>> {
    const queryString = this.buildQueryString(filters);
    return this.makeRequest(`/jadwal-pertandingan${queryString}`);
  }

  /**
   * Fetch sports news with filtering and pagination
   * @param filters - News filter parameters
   * @returns Promise with news data
   */
  static async getNews(filters: NewsFilters = {}): Promise<ApiResponse<{
    news: NewsArticle[];
    pagination: PaginationInfo;
    filters: NewsFilters;
    categories: string[];
    featured: NewsArticle[];
  }>> {
    const queryString = this.buildQueryString(filters);
    return this.makeRequest(`/berita-terkini${queryString}`);
  }

  /**
   * Fetch single news article by ID
   * @param id - News article ID
   * @returns Promise with news article data
   */
  static async getNewsById(id: string): Promise<ApiResponse<NewsArticle>> {
    return this.makeRequest(`/berita-terkini/${id}`);
  }

  /**
   * Fetch single schedule by ID
   * @param id - Schedule ID
   * @returns Promise with schedule data
   */
  static async getScheduleById(id: string): Promise<ApiResponse<Schedule>> {
    return this.makeRequest(`/jadwal-pertandingan/${id}`);
  }

  /**
   * Search across schedules and news
   * @param query - Search query
   * @param type - Search type ('all', 'schedules', 'news')
   * @returns Promise with search results
   */
  static async search(
    query: string, 
    type: 'all' | 'schedules' | 'news' = 'all'
  ): Promise<ApiResponse<{
    schedules?: Schedule[];
    news?: NewsArticle[];
    totalResults: number;
  }>> {
    const params = { q: query, type };
    const queryString = this.buildQueryString(params);
    return this.makeRequest(`/search${queryString}`);
  }
}