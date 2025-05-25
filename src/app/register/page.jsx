'use client'

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';


export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'guard',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // await axios.post('http://localhost:5000/api/auth/register', form);
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, form);
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-600 p-4">
      <form onSubmit={handleSubmit} className="max-w-md w-full bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <label className="block mb-2 font-semibold">Full Name</label>
        <input
          type="text"
          name="name"
          className="w-full border border-gray-300 rounded p-2 mb-4"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label className="block mb-2 font-semibold">Email</label>
        <input
          type="email"
          name="email"
          className="w-full border border-gray-300 rounded p-2 mb-4"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label className="block mb-2 font-semibold">Password</label>
        <input
          type="password"
          name="password"
          className="w-full border border-gray-300 rounded p-2 mb-4"
          value={form.password}
          onChange={handleChange}
          required
        />

        <label className="block mb-2 font-semibold">Role</label>
        <select
          name="role"
          className="w-full border border-gray-300 rounded p-2 mb-6"
          value={form.role}
          onChange={handleChange}
        >
          <option value="guard">Guard</option>
          <option value="host">Employee</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Register
        </button>

        <p className="mt-4 text-center">
          Already have an account?{' '}
          <a href="/" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
