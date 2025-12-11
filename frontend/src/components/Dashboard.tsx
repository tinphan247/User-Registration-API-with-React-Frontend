// frontend/src/components/Dashboard.tsx

import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogOut, User, Mail, Loader2, Server } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

// Hàm giả lập fetch Protected Data
const fetchProtectedData = async () => {
  // Axios Instance đã tự động gắn Access Token qua Interceptor
  const response = await axiosInstance.get('/auth/protected'); 
  return response.data;
};

const Dashboard: React.FC = () => {
  const { user, logout, accessToken } = useAuth();

  // Sử dụng React Query để fetch dữ liệu protected
  const { data, isLoading, error } = useQuery({
    queryKey: ['protectedData', accessToken],
    queryFn: () => fetchProtectedData(),
    enabled: !!accessToken, // Chỉ chạy query khi có Access Token
    retry: false, // Không cần retry vì Interceptor đã xử lý refresh
  });
  
  if (!user) return <p className="text-center p-8">Loading user data...</p>;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl p-10">
        <div className="text-center mb-8">
          <User className="w-16 h-16 text-teal-600 mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-gray-900">User Dashboard</h2>
          <p className="text-gray-500 mt-2">Welcome, you are logged in securely!</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border">
            <Mail className="w-6 h-6 text-teal-500" />
            <span className="font-medium text-gray-700">Email:</span>
            <span className="flex-1 text-right text-gray-800">{user.email}</span>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border">
            <User className="w-6 h-6 text-teal-500" />
            <span className="font-medium text-gray-700">User ID:</span>
            <span className="flex-1 text-right text-gray-800 break-all">{user.id}</span>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-700">
            <Server className='w-5 h-5' /> Protected API Data Status
        </h3>

        {isLoading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                <p className="text-sm text-blue-800">Fetching protected data...</p>
            </div>
        )}

        {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm font-medium text-red-800">Error Fetching Data</p>
                <p className="text-xs text-red-600 mt-1">
                    {/* Interceptor sẽ cố gắng refresh. Nếu lỗi 401 ở đây, có nghĩa là Refresh Token đã hết hạn */}
                    {error.message.includes('401') ? 'Authentication Failed. Please log in again.' : error.message}
                </p>
            </div>
        )}

        {data && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm font-medium text-green-800">API Response Successful!</p>
                <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto border">
                    {JSON.stringify(data, null, 2)}
                </pre>
            </div>
        )}

        <button
          onClick={logout}
          className="mt-8 w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;