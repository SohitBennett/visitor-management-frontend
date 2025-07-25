// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { Input } from "../components/ui/input"
// import { Button } from "../components/ui/button"

// export default function LoginPage() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const router = useRouter()

//   const handleLogin = async () => {
//     try {
//       // const res = await fetch('http://localhost:5000/api/auth/login', {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('role', data.user.role);

//         // Redirect based on role
//         if (data.user.role === 'host') router.push('/host');
//         else if (data.user.role === 'guard') router.push('/guard');
//         else if (data.user.role === 'admin') router.push('/admin');
//         else alert("Unknown role");
//       } else {
//         alert(data.message || "Login failed");
//       }
//     } catch (err) {
//       alert("Error logging in");
//     }
//   };

//   return (
//     <main className="flex flex-col items-center justify-center min-h-screen space-y-4">
//         <h1 className="text-3xl font-bold">Login</h1>
//         <div className='w-1/3'>
//           <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
//           <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//         </div>  
//         <Button onClick={handleLogin}>Login</Button>
//         <p className="mt-4 text-center">
//           Don't have an account?{' '}
//           <a href="/register" className="text-blue-600 hover:underline">
//             Register
//           </a>
//         </p>
//     </main>
//   );
// }





'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Eye, EyeOff, Lock, Mail, Loader2, LogIn } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    // Clear previous errors
    setError('')
    setIsLoading(true)

    try {
      // const res = await fetch('http://localhost:5000/api/auth/login', {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role);

        // Redirect based on role
        if (data.user.role === 'host') router.push('/host');
        else if (data.user.role === 'guard') router.push('/guard');
        else if (data.user.role === 'admin') router.push('/admin');
        else setError("Unknown role");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Error logging in");
    } finally {
      setIsLoading(false)
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Visitor Management System</h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-gray-800">Login</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
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
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white"
                    disabled={isLoading}
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white"
                    disabled={isLoading}
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
            </div>

            {/* Login Button */}
            <Button 
              onClick={handleLogin}
              disabled={isLoading || !email || !password}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </CardContent>

          <CardFooter className="pt-6">
            <p className="text-center text-sm text-gray-600 w-full">
              Don't have an account?{' '}
              <a 
                href="/register" 
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors hover:underline"
              >
                Create account
              </a>
            </p>
          </CardFooter>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}