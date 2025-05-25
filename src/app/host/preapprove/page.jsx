'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

export default function PreApproveVisitorPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contactInfo: '',
    purpose: '',
    organization: '',
    scheduledTime: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    // const res = await fetch(`http://localhost:5000/api/visitors/preapprove`, {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/visitors/preapprove`, {  
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert('Visitor pre-approved and QR sent!');
    } else {
      alert('Pre-approval failed');
    }
  };

  return (
    <main className='w-full h-screen bg-neutral-600 flex items-center justify-center'>
      <div className="p-6 max-w-xl mx-auto space-y-4 bg-white rounded-2xl">
        <h2 className="text-xl font-semibold">Pre-Approve a Visitor</h2>
        {Object.keys(formData).map((key) => (
          <Input
            key={key}
            name={key}
            placeholder={key}
            value={formData[key]}
            type={key === 'scheduledTime' ? 'datetime-local' : 'text'}
            onChange={handleChange}
          />
        ))}
        <div className='flex items-center justify-between'>
          <Button onClick={handleSubmit}>Pre-Approve</Button>
          <Button onClick={() => router.push('/host')}>Go to Home</Button>
          <Button onClick={() => router.push('/host/preapprove')}>Preapprove Another Visitor</Button>
        </div>
      </div>
    </main>  
  );
}
