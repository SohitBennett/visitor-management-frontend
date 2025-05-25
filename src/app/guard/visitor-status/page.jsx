'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export default function VisitorStatusPage() {
  const [visitor, setVisitor] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('lastRegisteredVisitor');
    if (stored) {
      setVisitor(JSON.parse(stored));
    }
    console.log(visitor);
  }, []);

  if (!visitor) {
    return (
      <div className="p-6 text-center">
        <p>No visitor found. Please register a visitor first.</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => router.push('/guard')}
        >
          Register Visitor
        </button>
      </div>
    );
  }

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');  
      // const res = await fetch(`http://localhost:5000/api/visitors/status/${visitor.visitor._id}`, {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/visitors/status/${visitor.visitor._id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
    //   setVisitor(data);
    //   visitor.visitor.status = data.status;
    visitor.visitor.status = data.visitor.status;
    } catch (err) {
      alert("Error refreshing status");
    }
    setLoading(false);
  };

  const handleCheckIn = async () => {
    try {
      const token = localStorage.getItem('token'); // adjust if you use cookies/session
      
      // const res = await fetch(`http://localhost:5000/api/visitors/${visitor.visitor._id}/checkin`, {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/visitors/${visitor.visitor._id}/checkin`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Check-in failed');
      }
  
      const data = await res.json();
      console.log('Visitor checked in:', data);
  
      // Redirect to badge generation page (customize as needed)
    //   router.push('/guard/badge');
        router.push(`/guard/badge?id=${visitor.visitor._id}`);

    } catch (error) {
      console.error('Check-in error:', error);
      alert(error.message);
    }
  };
  

  return (
    <div className='min-h-screen flex items-center justify-center bg-neutral-600'>
        <div className="max-w-xl mx-auto w-1/3 p-6 bg-white rounded-lg shadow">
            {/* <h2 className="text-2xl font-bold mb-4">Visitor Registration Summary</h2> */}
            <div className='flex justify-between items-center mb-4'>
                <h2 className="text-2xl font-bold">Visitor Registration Summary</h2>
                <button
                    onClick={handleRefresh}
                    className="text-black-600 font-semibold hover:text-black-800 transition"
                    title="Refresh Status"
                >
                    <ArrowPathIcon
                    className={`h-6 w-6 ${loading ? 'animate-spin' : ''}`}
                    />
                </button>
            </div>
            <ul className="space-y-2">
                {/* {console.log(visitor)} */}
                <li className="pt-2">
                    <strong>Message:</strong> {visitor.message}
                </li>
                <div className='border-2 border-neutral-800 rounded-md p-2'>
                    <li className="pt-2 tracking-tighter">
                        <strong>Name:</strong> {visitor.visitor.fullName}
                    </li>
                    <li className="pt-2 tracking-tighter">
                        <strong>Email:</strong> {visitor.visitor.email}
                    </li>
                    <li className="pt-2 tracking-tighter">
                        <strong>Phone Number:</strong> {visitor.visitor.contactInfo}
                    </li>
                    <li className="pt-2 tracking-tighter">
                        <strong>Purpose of Entry:</strong> {visitor.visitor.purpose}
                    </li>
                    <li className="pt-2 tracking-tighter">
                        <strong>Organization:</strong> {visitor.visitor.organization}
                    </li>
                </div>    
                {/* <li className="pt-2">
                    <strong>Approval Status:</strong> <h2 className='text-red-500'>{visitor.visitor.status}</h2>
                </li> */}
                <li className="pt-2 flex items-center gap-2">
                    <strong>Approval Status:</strong>
                    <span
                        className={`font-semibold ${
                        visitor.visitor.status === 'Pending'
                            ? 'text-blue-500'
                            : visitor.visitor.status === 'Approved'
                            ? 'text-green-600'
                            : 'text-red-500'
                        }`}
                    >
                        {visitor.visitor.status}
                    </span>
                </li>

            </ul>

            <div className='flex items-center justify-center gap-10'>        
                <button
                    onClick={() => router.push('/guard')}
                    className="mt-6 w-1/2 font-semibold tracking-tighter bg-blue-500 text-white py-2 rounded hover:bg-blue-700"
                >
                    Register Another Visitor
                </button>
                <button
                    onClick={handleCheckIn}
                    className="mt-6 w-1/2 font-semibold tracking-tighter bg-green-500 text-white py-2 rounded hover:bg-green-700"
                >
                    Check In Visitor 
                </button>
            </div>
        </div>
    </div>    
  );
}
