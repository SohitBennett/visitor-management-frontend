'use client';
import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { useRouter } from 'next/navigation'
import io from 'socket.io-client';
import { IoIosLogOut } from "react-icons/io";


// const socket = io('http://localhost:5000'); // Replace with your backend URL
const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`); 
export default function HostNotifications() {
  const [notifications, setNotifications] = useState([]);
    const router = useRouter();

  useEffect(() => {
    socket.on('visitorCheckedIn', (data) => {
      setNotifications((prev) => [...prev, data]);
    });

    return () => {
      socket.off('visitorCheckedIn');
    };
  }, []);

  return (
    <main className="min-h-screen p-8 bg-white text-black">
        <div className='flex items-center justify-between'>
        <h1 className="text-3xl font-bold mb-6">Visitor Check-In Notifications</h1>
        <div className='font-semibold tracking-tighter bg-neutral-300 rounded-xl flex items-center justify-center p-2 hover:bg-neutral-200 cursor-pointer'>
            <IoIosLogOut className='text-2xl' onClick={() => router.back()}/>
            Go to Home
        </div>

        </div>
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p>No check-ins yet.</p>
        ) : (
          notifications.map((notif, index) => (
            <div
              key={index}
              className="p-4 border border-green-500 rounded-md shadow-sm"
            >
              <p><strong>Name:</strong> {notif.fullName}</p>
              <p><strong>Email:</strong> {notif.email}</p>
              <p><strong>Check-In Time:</strong> {new Date(notif.checkInTime).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
