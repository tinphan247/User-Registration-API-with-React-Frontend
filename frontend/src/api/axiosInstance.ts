// frontend/src/api/axiosInstance.ts

import axios, { type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';
// API URL đọc từ biến môi trường của Vite
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://user-registration-api-lrek.onrender.com'
  : 'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Interceptor Request (Gắn Access Token) ---
axiosInstance.interceptors.request.use(
  (config) => {
    // Lấy token từ bộ nhớ (AuthContext/memory storage)
    // Giả định bạn có một cách để lấy Access Token hiện tại
    const accessToken = localStorage.getItem('accessToken_mem'); 
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// --- Interceptor Response (Xử lý Refresh Token) ---

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (error: AxiosError) => void }[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Bỏ qua nếu không phải lỗi 401 hoặc đã thử retry rồi
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    
    // Đánh dấu đã thử retry để tránh vòng lặp vô hạn
    originalRequest._retry = true;

    // Nếu đang refresh, thêm request vào queue
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve: () => resolve(axiosInstance(originalRequest)), reject });
      });
    }

    // Bắt đầu quá trình refresh
    isRefreshing = true;
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      // Nếu không có Refresh Token, đẩy lỗi 401 thật để log out
      isRefreshing = false;
      return Promise.reject(error);
    }

    try {
      // Gọi API refresh token
      const refreshResponse: AxiosResponse<{ accessToken: string; refreshToken: string }> = await axios.post(
        `${API_BASE_URL}/auth/refresh`, 
        {},
        {
          headers: { Authorization: `Bearer ${refreshToken}` },
        }
      );

      const newAccessToken = refreshResponse.data.accessToken;
      const newRefreshToken = refreshResponse.data.refreshToken;

      // Cập nhật tokens (giả lập lưu vào Context/localStorage)
      localStorage.setItem('accessToken_mem', newAccessToken); // Access Token (in-memory simulation)
      localStorage.setItem('refreshToken', newRefreshToken);   // Refresh Token (persistent)

      // Cập nhật header cho request gốc đang bị lỗi
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
      
      // Xử lý queue và request gốc
      processQueue(null, newAccessToken);
      
      return axiosInstance(originalRequest);
    } catch (refreshError: any) {
      // Refresh Token thất bại (RT hết hạn hoặc không hợp lệ)
      processQueue(refreshError, null);
      
      // Tự động Logout User: Phát ra một sự kiện hoặc call hàm logout
      // Vì không thể truy cập AuthContext trực tiếp ở đây, 
      // ta cần 1 cách để kích hoạt logout UI (ví dụ: dùng Event Emitter hoặc Custom Hook ở Component cao hơn)
      // Tạm thời, ta chỉ reject lỗi, và UI sẽ xử lý việc logout khi nhận được lỗi này.
      
      // Đánh dấu trạng thái refresh đã xong (thất bại)
      // LƯU Ý: Phải xử lý logout ở component cao hơn!
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosInstance;