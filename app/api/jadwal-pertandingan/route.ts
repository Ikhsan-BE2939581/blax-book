import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Input validation schema
const scheduleQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
  date: z.string().optional(),
  team: z.string().optional(),
  league: z.string().optional(),
  venue: z.string().optional(),
  type: z.string().optional(),
  sortBy: z.enum(['date', 'venue', 'fee', 'availability']).optional().default('date'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

// Mock data for sports schedules
const mockSchedules = [
  {
    id: '1',
    date: '2025-01-15',
    time: '19:00',
    venue: 'Lapangan Futsal Central',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat',
    homeTeam: 'Team Alpha',
    awayTeam: 'Team Beta',
    league: 'Liga Futsal Jakarta',
    slotsAvailable: 8,
    totalSlots: 16,
    fee: 75000,
    type: 'Mix',
    facilities: ['Air Mineral', 'Rompi', 'Bola', 'Shower'],
    description: 'Pertandingan mix untuk semua level pemain',
    image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg',
    weather: 'Cerah, 28°C',
    referee: 'Ahmad Referee',
    status: 'open',
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z',
  },
  {
    id: '2',
    date: '2025-01-16',
    time: '20:00',
    venue: 'GOR Senayan Mini Soccer',
    address: 'Jl. Pintu Satu Senayan, Jakarta Pusat',
    homeTeam: 'Team Gamma',
    awayTeam: 'Team Delta',
    league: 'Liga Mini Soccer',
    slotsAvailable: 12,
    totalSlots: 16,
    fee: 85000,
    type: 'Open',
    facilities: ['Air Mineral', 'Rompi', 'Bola', 'Shower', 'Kantin'],
    description: 'Pertandingan terbuka untuk semua pemain',
    image: 'https://images.pexels.com/photos/1171084/pexels-photo-1171084.jpeg',
    weather: 'Berawan, 26°C',
    referee: 'Budi Referee',
    status: 'open',
    createdAt: '2025-01-09T14:30:00Z',
    updatedAt: '2025-01-09T14:30:00Z',
  },
  {
    id: '3',
    date: '2025-01-17',
    time: '18:30',
    venue: 'Lapangan Futsal Central',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat',
    homeTeam: 'Team Epsilon',
    awayTeam: 'Team Zeta',
    league: 'Championship League',
    slotsAvailable: 3,
    totalSlots: 16,
    fee: 75000,
    type: 'Championship',
    facilities: ['Air Mineral', 'Rompi', 'Bola', 'Wasit', 'Trophy'],
    description: 'Pertandingan kompetitif dengan wasit resmi',
    image: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg',
    weather: 'Hujan ringan, 24°C',
    referee: 'Charlie Referee',
    status: 'almost_full',
    createdAt: '2025-01-08T09:15:00Z',
    updatedAt: '2025-01-08T09:15:00Z',
  },
  {
    id: '4',
    date: '2025-01-18',
    time: '19:30',
    venue: 'Arena Futsal Jakarta',
    address: 'Jl. Gatot Subroto No. 456, Jakarta Selatan',
    homeTeam: 'Team Eta',
    awayTeam: 'Team Theta',
    league: 'Liga Futsal Jakarta',
    slotsAvailable: 6,
    totalSlots: 16,
    fee: 70000,
    type: 'Open',
    facilities: ['Air Mineral', 'Rompi', 'Bola'],
    description: 'Pertandingan santai untuk bersenang-senang',
    image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg',
    weather: 'Cerah, 30°C',
    referee: 'David Referee',
    status: 'open',
    createdAt: '2025-01-07T16:45:00Z',
    updatedAt: '2025-01-07T16:45:00Z',
  },
  {
    id: '5',
    date: '2025-01-19',
    time: '20:30',
    venue: 'GOR Senayan Mini Soccer',
    address: 'Jl. Pintu Satu Senayan, Jakarta Pusat',
    homeTeam: 'Team Iota',
    awayTeam: 'Team Kappa',
    league: 'Liga Mini Soccer',
    slotsAvailable: 10,
    totalSlots: 16,
    fee: 85000,
    type: 'Mix',
    facilities: ['Air Mineral', 'Rompi', 'Bola', 'Shower'],
    description: 'Mix game untuk networking dan bersenang-senang',
    image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg',
    weather: 'Cerah, 27°C',
    referee: 'Eva Referee',
    status: 'open',
    createdAt: '2025-01-06T11:20:00Z',
    updatedAt: '2025-01-06T11:20:00Z',
  },
];

/**
 * Sports Schedule Service
 * Handles business logic for schedule operations
 */
class ScheduleService {
  /**
   * Get filtered and paginated schedules
   * @param filters - Filter parameters
   * @returns Filtered schedules with pagination info
   */
  static getSchedules(filters: any) {
    let filteredSchedules = [...mockSchedules];

    // Apply filters
    if (filters.date) {
      filteredSchedules = filteredSchedules.filter(
        schedule => schedule.date === filters.date
      );
    }

    if (filters.team) {
      const teamQuery = filters.team.toLowerCase();
      filteredSchedules = filteredSchedules.filter(
        schedule => 
          schedule.homeTeam.toLowerCase().includes(teamQuery) ||
          schedule.awayTeam.toLowerCase().includes(teamQuery)
      );
    }

    if (filters.league) {
      filteredSchedules = filteredSchedules.filter(
        schedule => schedule.league.toLowerCase().includes(filters.league.toLowerCase())
      );
    }

    if (filters.venue) {
      filteredSchedules = filteredSchedules.filter(
        schedule => schedule.venue.toLowerCase().includes(filters.venue.toLowerCase())
      );
    }

    if (filters.type) {
      filteredSchedules = filteredSchedules.filter(
        schedule => schedule.type.toLowerCase() === filters.type.toLowerCase()
      );
    }

    // Apply sorting
    filteredSchedules.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'venue':
          comparison = a.venue.localeCompare(b.venue);
          break;
        case 'fee':
          comparison = a.fee - b.fee;
          break;
        case 'availability':
          comparison = b.slotsAvailable - a.slotsAvailable;
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
    
    const paginatedSchedules = filteredSchedules.slice(startIndex, endIndex);
    
    return {
      schedules: paginatedSchedules,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredSchedules.length / limit),
        totalItems: filteredSchedules.length,
        itemsPerPage: limit,
        hasNextPage: endIndex < filteredSchedules.length,
        hasPreviousPage: page > 1,
      },
      filters: filters,
    };
  }
}

/**
 * GET /api/jadwal-pertandingan
 * Fetch sports schedules with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Validate query parameters
    const validationResult = scheduleQuerySchema.safeParse({
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
      date: searchParams.get('date') || undefined,
      team: searchParams.get('team') || undefined,
      league: searchParams.get('league') || undefined,
      venue: searchParams.get('venue') || undefined,
      type: searchParams.get('type') || undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: searchParams.get('sortOrder') || undefined,
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
    
    // Get schedules with filters applied
    const result = ScheduleService.getSchedules(filters);

    return NextResponse.json(
      {
        success: true,
        message: 'Schedules retrieved successfully',
        data: result,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Schedule API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}