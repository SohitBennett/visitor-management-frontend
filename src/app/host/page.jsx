'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';
import { FcApprove } from "react-icons/fc";
import { FcDisapprove } from "react-icons/fc";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function HostDashboard() {
  const [host, setHost] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchHostData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("No token found!");
        return;
      }

      // Decode token to get host ID
      const payload = JSON.parse(atob(token.split('.')[1]));
      const hostId = payload.id;

      try {
        // const res = await fetch(`http://localhost:5000/api/auth/status/${hostId}`, {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/status/${hostId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Host data fetch failed");

        const data = await res.json();
        setHost(data.user);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch host data");
      }
    };

    fetchHostData();
  }, []);

  if (!host) return <p className="text-center mt-10">Loading...</p>;

  return (
    <main className='w-full h-screen bg-neutral-500 flex items-center justify-center'>
      <div className="bg-neutral-300 rounded-xl p-6 space-y-4 max-w-xl mx-auto">
        
        <h2 className="text-2xl font-bold tracking-tighter">Welcome to Employee Dashboard</h2>
        <p className='font-semibold tracking-tighter mb-10'>Email: {host.email}</p>
        {/* <p>Department: {host.department}</p> */}

        <div className="space-y-3 mt-6">
          <Button
            className="w-full flex items-center justify-between"
            onClick={() => router.push('/host/requests')}
          >
            View & Approve Pending Visitors    
            <FcApprove className='text-2xl'/>
            <FcDisapprove className='text-2xl'/>
          </Button>

          <Button
            className="w-full"
            variant="outline"
            onClick={() => router.push('/host/preapprove')}
          >
            Pre-Approve a Visitor
          </Button>
          <div className='flex gap-1'>
            <div className='rounded-full' >
              <IoMdArrowRoundBack className='text-2xl rounded-full  hover:bg-neutral-400 transition' onClick={() => router.push('/login')}/>  
            </div>
            <span className='font-semibold tracking-tighter '>Go back to Login</span>
          </div>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => router.push('/host/notification')}
          >
            Notifications
          </Button>
          

        </div>
      </div>
    </main>  
  );
}
