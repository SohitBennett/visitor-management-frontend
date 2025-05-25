// 'use client'

// import { useState } from 'react'
// import { Input } from "../../components/ui/input"
// import { Button } from "../../components/ui/button"
// import { useRouter } from 'next/navigation'

// export default function RegisterVisitorPage() {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     contactInfo: '',
//     purpose: '',
//     hostEmail: '',
//     hostDepartment: '',
//     organization: '',
//     // scheduledTime: '',
//   });

//   const router = useRouter();

//   const handleChange = (e) => {
//     setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async () => {
//     const res = await fetch(`http://localhost:5000/api/visitors/register`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${localStorage.getItem('token')}`,
//       },
//       body: JSON.stringify({ ...formData, preApproved: false }),
//     });

//     if (res.ok) {
//       alert("Visitor registered!");
//       const data = await res.json(); // assuming the response returns visitor info
//       localStorage.setItem('lastRegisteredVisitor', JSON.stringify(data));
//       router.push('/guard/visitor-status');
//       // router.push('/guard');
//     } else {
//       alert("Error registering visitor");
//     }
//   };

//   return (
//     <main className="p-6 space-y-4 max-w-xl mx-auto">
//       <h2 className="text-2xl font-bold mb-2">Register New Visitor</h2>
//       {Object.keys(formData).map((key) => (
//         <Input
//           key={key}
//           name={key}
//           placeholder={key}
//           value={formData[key]}
//           onChange={handleChange}
//           // type={key === 'scheduledTime' ? 'datetime-local' : 'text'}
//         />
//       ))}
//       <Button onClick={handleSubmit}>Submit</Button>
//     </main>
//   );
// }


//trying image uplaod 

'use client';

import { useState } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { useRouter } from 'next/navigation';

export default function RegisterVisitorPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contactInfo: '',
    purpose: '',
    hostEmail: '',
    hostDepartment: '',
    organization: '',
  });
  const [photo, setPhoto] = useState(null);

  const router = useRouter();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const form = new FormData();

    for (const key in formData) {
      form.append(key, formData[key]);
    }

    form.append('photo', photo);
    form.append('preApproved', false); // manually set

    // const res = await fetch('http://localhost:5000/api/visitors/register', {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/visitors/register`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: form,
    });

    if (res.ok) {
      alert('Visitor registered!');
      const data = await res.json();
      localStorage.setItem('lastRegisteredVisitor', JSON.stringify(data));
      router.push('/guard/visitor-status');
    } else {
      alert('Error registering visitor');
    }
  };

  return (
    <main className="p-6 space-y-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Register New Visitor</h2>
      {Object.keys(formData).map((key) => (
        <Input
          key={key}
          name={key}
          placeholder={key}
          value={formData[key]}
          onChange={handleChange}
        />
      ))}

      <Input type="file" accept="image/*" onChange={handlePhotoChange} />
      <Button onClick={handleSubmit}>Submit</Button>
    </main>
  );
}
