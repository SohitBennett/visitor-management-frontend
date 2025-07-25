// 'use client'

// import { useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';


// export default function Register() {
//   const router = useRouter();
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     password: '',
//     role: 'guard',
//   });
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     try {
//       // await axios.post('http://localhost:5000/api/auth/register', form);
//       await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, form);
//       router.push('/');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Registration failed');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-neutral-600 p-4">
//       <form onSubmit={handleSubmit} className="max-w-md w-full bg-white p-8 rounded-xl shadow">
//         <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
//         {error && <p className="text-red-500 mb-4">{error}</p>}

//         <label className="block mb-2 font-semibold">Full Name</label>
//         <input
//           type="text"
//           name="name"
//           className="w-full border border-gray-300 rounded p-2 mb-4"
//           value={form.name}
//           onChange={handleChange}
//           required
//         />

//         <label className="block mb-2 font-semibold">Email</label>
//         <input
//           type="email"
//           name="email"
//           className="w-full border border-gray-300 rounded p-2 mb-4"
//           value={form.email}
//           onChange={handleChange}
//           required
//         />

//         <label className="block mb-2 font-semibold">Password</label>
//         <input
//           type="password"
//           name="password"
//           className="w-full border border-gray-300 rounded p-2 mb-4"
//           value={form.password}
//           onChange={handleChange}
//           required
//         />

//         <label className="block mb-2 font-semibold">Role</label>
//         <select
//           name="role"
//           className="w-full border border-gray-300 rounded p-2 mb-6"
//           value={form.role}
//           onChange={handleChange}
//         >
//           <option value="guard">Guard</option>
//           <option value="host">Employee</option>
//           <option value="admin">Admin</option>
//         </select>

//         <button
//           type="submit"
//           className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
//         >
//           Register
//         </button>

//         <p className="mt-4 text-center">
//           Already have an account?{' '}
//           <a href="/" className="text-blue-600 hover:underline">
//             Login
//           </a>
//         </p>
//       </form>
//     </div>
//   );
// }



'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Eye, EyeOff, Lock, Mail, User, UserPlus, Loader2, Shield } from "lucide-react"

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'guard',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value) => {
    setForm({ ...form, role: value });
  };

  const handleSubmit = async () => {
    setError('');
    setIsLoading(true);

    try {
      // await axios.post('http://localhost:5000/api/auth/register', form);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        router.push('/');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return '👑';
      case 'host': return '💼';
      case 'guard': return '🛡️';
      default: return '👤';
    }
  };

  const getRoleDescription = (role) => {
    switch(role) {
      case 'admin': return 'Full system access and management';
      case 'host': return 'Employee with hosting privileges';
      case 'guard': return 'Security and monitoring access';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Visitor Managament System</h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-gray-800">Register</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Fill in your details to create a new account
            </CardDescription>
          </CardHeader>
          
          <div onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                {/* Full Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={handleChange}
                      className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 bg-white"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={handleChange}
                      className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 bg-white"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create a secure password"
                      value={form.password}
                      onChange={handleChange}
                      className="pl-10 pr-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 bg-white"
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                    Role
                  </Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                    <Select value={form.role} onValueChange={handleRoleChange} disabled={isLoading}>
                      <SelectTrigger className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 bg-white">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="guard" className="cursor-pointer">
                          <div className="flex items-center space-x-2">
                            <span>{getRoleIcon('guard')}</span>
                            <div>
                              <div className="font-medium">Guard</div>
                              <div className="text-xs text-gray-500">{getRoleDescription('guard')}</div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="host" className="cursor-pointer">
                          <div className="flex items-center space-x-2">
                            <span>{getRoleIcon('host')}</span>
                            <div>
                              <div className="font-medium">Employee</div>
                              <div className="text-xs text-gray-500">{getRoleDescription('host')}</div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="admin" className="cursor-pointer">
                          <div className="flex items-center space-x-2">
                            <span>{getRoleIcon('admin')}</span>
                            <div>
                              <div className="font-medium">Admin</div>
                              <div className="text-xs text-gray-500">{getRoleDescription('admin')}</div>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Selected Role Info */}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-lg">{getRoleIcon(form.role)}</span>
                    <div>
                      <span className="font-medium text-gray-800">
                        {form.role === 'host' ? 'Employee' : form.role.charAt(0).toUpperCase() + form.role.slice(1)}
                      </span>
                      <p className="text-xs text-gray-600 mt-1">{getRoleDescription(form.role)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Register Button */}
              <Button 
                onClick={handleSubmit}
                disabled={isLoading || !form.name || !form.email || !form.password}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Account
                  </>
                )}
              </Button>
            </CardContent>
          </div>

          <CardFooter className="pt-6">
            <p className="text-center text-sm text-gray-600 w-full">
              Already have an account?{' '}
              <a 
                href="/" 
                className="font-medium text-green-600 hover:text-green-500 transition-colors hover:underline"
              >
                Sign in here
              </a>
            </p>
          </CardFooter>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}