// frontend/src/auth/AuthContext.tsx
import React, { createContext, useState, useEffect, type ReactNode } from 'react'; // SỬA ĐỔIimport axiosInstance from '../api/axiosInstance';
import axiosInstance from '../api/axiosInstance'; // THÊM DÒNG NÀY
interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  // Các hàm khác...
}

const initialAuthState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: localStorage.getItem('refreshToken'), // Khởi tạo từ localStorage
  isAuthenticated: !!localStorage.getItem('refreshToken'),
  login: () => Promise.resolve(),
  logout: () => {},
};

export const AuthContext = createContext<AuthState>(initialAuthState);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // LƯU Ý: Access Token KHÔNG nên lưu trong state React nếu muốn nó "in-memory" thực sự
  // Tạm thời dùng state để kích hoạt re-render cho Protected Routes
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken_mem')); 
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));
  const isAuthenticated = !!user; // Xác thực dựa trên user tồn tại

  // Giả lập lấy thông tin user từ Access Token (bằng cách decode token hoặc gọi API /me)
  const decodeUserFromToken = (token: string): User => {
    // **Trong môi trường thực, bạn cần decode JWT token hoặc call /me API**
    // Để đơn giản, ta chỉ lấy email từ form login hoặc gọi mock API
    return { id: 'mock-id-123', email: 'user@example.com' }; 
  }
  
  // Tải lại trạng thái User khi component mount
  useEffect(() => {
    if (refreshToken && accessToken) {
        // Trong dự án thực, bạn sẽ gọi API /me ở đây để xác nhận token còn hiệu lực
        try {
            setUser(decodeUserFromToken(accessToken));
        } catch (e) {
            console.error("Invalid stored token, logging out.");
            handleLogout();
        }
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const loginEndpoint = '/auth/login'; // Endpoint đăng nhập backend
    
    try {
      const response = await axiosInstance.post(loginEndpoint, { email, password });
      const { accessToken, refreshToken, user: userData } = response.data;
      
      // 1. Lưu Refresh Token vào Local Storage (Persistent)
      localStorage.setItem('refreshToken', refreshToken);
      setRefreshToken(refreshToken);

      // 2. Lưu Access Token vào một biến "In-memory" (Simulation in localStorage)
      localStorage.setItem('accessToken_mem', accessToken);
      setAccessToken(accessToken);

      // 3. Thiết lập User
      setUser(userData || decodeUserFromToken(accessToken));

    } catch (e: any) {
      console.error('Login Failed:', e.response?.data?.message || e.message);
      throw e; // Ném lỗi để React Query/Form xử lý
    }
  };

  const handleLogout = async () => {
    try {
        await axiosInstance.post('/auth/logout', {});
    } catch (e) {
        console.warn('Logout API failed, forcing client-side logout:', e);
    }
    
    // Xóa tất cả tokens
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken_mem');
    
    setRefreshToken(null);
    setAccessToken(null);
    setUser(null);
  };
  
  // Xử lý lỗi 401 khi Refresh Token cũng thất bại (từ axiosInstance)
  // Bạn có thể thêm logic lắng nghe sự kiện ở đây nếu dùng Event Emitter
  
  // Giá trị Context
  const contextValue: AuthState = {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};