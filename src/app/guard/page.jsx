'use client'

import { useRouter } from 'next/navigation'
import { Button } from "../components/ui/button"
import { IoIosLogOut } from "react-icons/io";

export default function GuardHome() {
  const router = useRouter();

  const handleLogout = () => {
    // Step 1: Clear stored auth/session data
    localStorage.removeItem('token');     // if you're storing token
    localStorage.removeItem('user');      // if you're storing user info
    sessionStorage.clear();               // optional: clear all session data

    // Step 2: Redirect to login page
    router.push('/');
    // router.back();
  };

  return (
    <div className='min-h-screen bg-neutral-600 flex items-center justify-center'>
      <main className="bg-slate-200 rounded-xl p-5 flex flex-col items-center justify-center space-y-6">
        <h1 className="text-3xl font-bold mb-5">Guard Portal</h1>
        <div className="space-x-4">
          <Button onClick={() => router.push('/guard/preapproved')}>Pre-approved Visitor</Button>
          <Button onClick={() => router.push('/guard/register')}>Register New Visitor</Button>
          <Button onClick={() => router.push('/guard/checkout')}>CheckOut Visitor</Button>
        </div>
        {/* <Button onClick={handleLogout}>LogOut</Button> */}
        <button className='font-semibold tracking-tighter bg-neutral-300 rounded-xl flex items-center justify-center p-2 hover:bg-neutral-200 cursor-pointer'>
          <IoIosLogOut className='text-2xl' onClick={handleLogout}/>
          Logout
        </button>
        
      </main>
    </div>  
  );
}
