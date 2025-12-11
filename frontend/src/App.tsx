// frontend/src/App.tsx (MODIFIED)

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { AlertCircle, CheckCircle2, Loader2, User, Lock, Mail, Home } from 'lucide-react';
import { AuthProvider } from './auth/AuthContext';
import { useAuth } from './hooks/useAuth';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import axiosInstance from './api/axiosInstance'; // Import axios instance

const queryClient = new QueryClient();

// Tái cấu trúc: tách các trang để dùng với Router

interface FormData {
  email: string;
  password: string;
}

// ------------------- API Call (Sử dụng Axios) -------------------
const registerUser = async (userData: FormData) => {
  const response = await axiosInstance.post('/user/register', userData);
  return response.data;
};

// ------------------- Pages/Components (Tái sử dụng logic cũ) -------------------

// Dùng HomePage, SignUpPage, LoginPage logic cũ nhưng điều hướng bằng useNavigate()
const HomePage = () => {
    const navigate = useNavigate();
    return (
        // ... (Nội dung HomePage cũ)
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            <div className="text-center">
              <Home className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to User Registration System
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                A complete authentication solution with secure registration and login
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/signup')}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
    );
}

const SignUpPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const [successMessage, setSuccessMessage] = useState('');

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      setSuccessMessage('Registration successful! Redirecting to login...');
      reset();
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    },
    onError: (error: any) => {
      setSuccessMessage('');
      console.error(error);
      // Hiển thị lỗi từ backend
      // error.response.data.message là thông điệp từ NestJS ConflictException
    },
  });

  const onSubmit = (data: FormData) => {
    setSuccessMessage('');
    mutation.mutate(data);
  };
  
  // ... (Giao diện SignUpPage cũ)
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <User className="w-12 h-12 text-purple-600 mx-auto mb-3" />
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-600 mt-2">Sign up to get started</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.password.message}
              </p>
            )}
          </div>

          {mutation.isError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Registration Failed</p>
                {/* Lấy thông báo lỗi từ NestJS */}
                <p className="text-sm text-red-600 mt-1">{(mutation.error as any).response?.data?.message || mutation.error?.message}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">{successMessage}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={mutation.isPending}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Already have an account? Login
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-700 text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};


const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // SỬ DỤNG HÀM LOGIN TỪ CONTEXT
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const [loginError, setLoginError] = useState('');
  const [loginMessage, setLoginMessage] = useState('');

  const mutation = useMutation({
    mutationFn: ({ email, password }: FormData) => login(email, password),
    onSuccess: () => {
      setLoginMessage('Login successful! Redirecting to Dashboard.');
      setLoginError('');
      reset();
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    },
    onError: (error: any) => {
      setLoginMessage('');
      setLoginError(error.response?.data?.message || error.message || 'Login failed, please check your credentials.');
    },
  });

  const onSubmit = (data: FormData) => {
    setLoginError('');
    setLoginMessage('');
    mutation.mutate(data);
  };
  
  // ... (Giao diện LoginPage cũ, sử dụng logic mới)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <Lock className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Login to your account</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                {...register('password', {
                  required: 'Password is required',
                })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.password.message}
              </p>
            )}
          </div>

          {loginError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{loginError}</p>
            </div>
          )}

          {loginMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">{loginMessage}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={mutation.isPending}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/signup')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Don't have an account? Sign Up
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-700 text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};


const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Router>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/signup" element={<SignUpPage />} />
                        <Route path="/login" element={<LoginPage />} />

                        {/* Protected Route */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Fallback/Redirect */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Router>
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default App;