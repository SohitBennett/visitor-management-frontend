'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
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
        else alert("Unknown role");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Error logging in");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <h1 className="text-3xl font-bold">Login</h1>
        <div className='w-1/3'>
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>  
        <Button onClick={handleLogin}>Login</Button>
        <p className="mt-4 text-center">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
    </main>
  );
}
