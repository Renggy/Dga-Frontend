import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

/**
 * ApiService - Centralized Axios instance for API requests.
 */
class ApiService {
  private service: AxiosInstance;

  constructor() {
    this.service = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL as string,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Request Interceptor: Attach Auth Token
    this.service.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = Cookies.get('token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    // Response Interceptor: Global Error Handling
    this.service.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      (error: any) => {
        if (error.response && error.response.status === 401) {
          // Auto logout on 401 Unauthorized
          Cookies.remove('token');
          window.location.href = '/login';
        }
        return Promise.reject(error.response?.data || error.message);
      }
    );
  }

  /**
   * GET Request
   */
  get<T = any>(url: string, params: Record<string, any> = {}, config: AxiosRequestConfig = {}): Promise<T> {
    return this.service.get(url, { params, ...config });
  }

  /**
   * POST Request
   */
  post<T = any>(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<T> {
    console.log('ApiService.post called with url:', url, 'data:', data);
    return this.service.post(url, data, config);
  }

  /**
   * PUT Request
   */
  put<T = any>(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<T> {
    return this.service.put(url, data, config);
  }

  /**
   * PATCH Request
   */
  patch<T = any>(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<T> {
    return this.service.patch(url, data, config);
  }

  /**
   * DELETE Request
   */
  delete<T = any>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
    return this.service.delete(url, config);
  }
}

export default new ApiService();
