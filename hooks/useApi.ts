import { useState, useEffect, useCallback } from 'react';
import { ApiService, ScheduleFilters, NewsFilters } from '@/services/apiService';
import { useErrorHandler } from '@/utils/errorHandler';
import { useNotification } from './useNotification';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for API calls with loading states and error handling
 * @param apiCall - Function that returns a promise with API response
 * @param dependencies - Dependencies array for useEffect
 * @param options - Configuration options
 * @returns API state and refetch function
 */
export const useApi = <T>(
  apiCall: () => Promise<{ success: boolean; data?: T; error?: string }>,
  dependencies: any[] = [],
  options: {
    immediate?: boolean;
    showErrorNotification?: boolean;
    showSuccessNotification?: boolean;
  } = {}
): UseApiState<T> => {
  const { immediate = true, showErrorNotification = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleError } = useErrorHandler();
  const { error: showError } = useNotification();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      
      if (response.success && response.data) {
        setData(response.data);
      } else {
        const errorMessage = response.error || 'Request failed';
        setError(errorMessage);
        
        if (showErrorNotification) {
          showError('Request Failed', errorMessage, 5000);
        }
      }
    } catch (err) {
      const errorInfo = handleError(err);
      setError(errorInfo.message);
      
      if (showErrorNotification) {
        showError('Error', errorInfo.message, 5000);
      }
    } finally {
      setLoading(false);
    }
  }, [apiCall, handleError, showError, showErrorNotification]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

/**
 * Hook for fetching sports schedules
 * @param filters - Schedule filter parameters
 * @param options - Configuration options
 * @returns Schedules data and state
 */
export const useSchedules = (
  filters: ScheduleFilters = {},
  options?: { immediate?: boolean; showErrorNotification?: boolean }
) => {
  return useApi(
    () => ApiService.getSchedules(filters),
    [JSON.stringify(filters)],
    options
  );
};

/**
 * Hook for fetching sports news
 * @param filters - News filter parameters
 * @param options - Configuration options
 * @returns News data and state
 */
export const useNews = (
  filters: NewsFilters = {},
  options?: { immediate?: boolean; showErrorNotification?: boolean }
) => {
  return useApi(
    () => ApiService.getNews(filters),
    [JSON.stringify(filters)],
    options
  );
};

/**
 * Hook for fetching single schedule by ID
 * @param id - Schedule ID
 * @param options - Configuration options
 * @returns Schedule data and state
 */
export const useSchedule = (
  id: string,
  options?: { immediate?: boolean; showErrorNotification?: boolean }
) => {
  return useApi(
    () => ApiService.getScheduleById(id),
    [id],
    options
  );
};

/**
 * Hook for fetching single news article by ID
 * @param id - News article ID
 * @param options - Configuration options
 * @returns News article data and state
 */
export const useNewsArticle = (
  id: string,
  options?: { immediate?: boolean; showErrorNotification?: boolean }
) => {
  return useApi(
    () => ApiService.getNewsById(id),
    [id],
    options
  );
};

/**
 * Hook for search functionality
 * @param query - Search query
 * @param type - Search type
 * @param options - Configuration options
 * @returns Search results and state
 */
export const useSearch = (
  query: string,
  type: 'all' | 'schedules' | 'news' = 'all',
  options?: { immediate?: boolean; showErrorNotification?: boolean }
) => {
  return useApi(
    () => ApiService.search(query, type),
    [query, type],
    { immediate: false, ...options }
  );
};