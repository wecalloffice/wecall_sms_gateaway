import { LoginForm } from "@/features/auth/components/login-form";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  return <LoginForm />;
}


// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';

// export default function LoginPage() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       // Simulate API call - in real app, call mockAuth.login or actual backend
//       const response = await new Promise<{
//         token: string;
//         user: { role: string; account_sid: string; username: string };
//       }>((resolve) => {
//         setTimeout(() => {
//           // Mock role detection based on username
//           let role = 'RESELLER_ADMIN';
//           if (/platform|admin/.test(username.toLowerCase())) {
//             role = 'PLATFORM_ADMIN';
//           } else if (/rdb|imhold|client/.test(username.toLowerCase())) {
//             role = 'CLIENT_ADMIN';
//           }

//           resolve({
//             token: 'mock-token-' + Math.random().toString(36).slice(2),
//             user: { role, account_sid: 'AC_' + username, username },
//           });
//         }, 1000);
//       });

//       // Store auth data
//       localStorage.setItem('authToken', response.token);
//       localStorage.setItem('userRole', response.user.role);
//       localStorage.setItem('username', response.user.username);

//       // Role-based redirect
//       if (response.user.role === 'PLATFORM_ADMIN') {
//         router.push('/platform/dashboard');
//       } else if (response.user.role === 'RESELLER_ADMIN') {
//         router.push('/reseller/dashboard');
//       } else if (response.user.role === 'CLIENT_ADMIN') {
//         router.push('/client/dashboard');
//       }
//     } catch (err: any) {
//       setError(err.message || 'Login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
//       <div className="w-full max-w-md">
//         {/* Card */}
//         <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
//           {/* Logo */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>
//               WeCall SMS
//             </h1>
//             <p className="text-gray-600 text-sm mt-2">Platform Management Dashboard</p>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
//               <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
//               <p className="text-sm text-red-700">{error}</p>
//             </div>
//           )}

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Username Field */}
//             <div>
//               <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
//                 Username
//               </label>
//               <input
//                 id="username"
//                 type="text"
//                 placeholder="e.g., kcb, admin, rdb"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//                 required
//               />
//               <p className="text-xs text-gray-500 mt-1">
//                 Try: "admin" (Platform), "kcb" (Reseller), or "rdb" (Client)
//               </p>
//             </div>

//             {/* Password Field */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   id="password"
//                   type={showPassword ? 'text' : 'password'}
//                   placeholder="Enter your password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                 >
//                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <LogIn size={18} />
//               {loading ? 'Logging in...' : 'Login'}
//             </button>
//           </form>

//           {/* Demo Info */}
//           <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//             <p className="text-xs font-medium text-blue-900 mb-2">Demo Credentials:</p>
//             <ul className="text-xs text-blue-800 space-y-1">
//               <li>• <strong>Platform Admin:</strong> username "admin"</li>
//               <li>• <strong>Reseller:</strong> username "kcb"</li>
//               <li>• <strong>Client:</strong> username "rdb"</li>
//               <li>• <strong>Password:</strong> any value</li>
//             </ul>
//           </div>

//           {/* Registration Link */}
//           <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
//             <p className="text-xs text-gray-700 text-center mb-3">
//               Don't have an account yet?
//             </p>
//             <Link
//               href="/register"
//               className="w-full block text-center px-4 py-2 border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors"
//             >
//               Create New Account
//             </Link>
//             <p className="text-xs text-gray-500 text-center mt-3">
//               Resellers and Clients can self-register here
//             </p>
//           </div>

//           {/* Footer */}
//           <p className="text-center text-xs text-gray-500 mt-8">
//             © 2025 WeCall SMS. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
