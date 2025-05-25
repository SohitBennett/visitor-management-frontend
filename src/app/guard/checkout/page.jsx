// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from '../../components/ui/button';
// import dynamic from 'next/dynamic';

// const QrReader = dynamic(() => import('react-qr-reader'), { ssr: false });

// export default function GuardCheckoutPage() {
//   const [qrData, setQrData] = useState('');
//   const [scanned, setScanned] = useState(false);
//   const [visitorId, setVisitorId] = useState('');
//   const [message, setMessage] = useState('');
//   const router = useRouter();

//   const handleQRScan = (data) => {
//     if (data && !scanned) {
//       try {
//         const parsed = JSON.parse(data);
//         setVisitorId(parsed.visitorId);
//         setQrData(data);
//         setScanned(true);
//         setMessage('QR scanned successfully');
//       } catch {
//         setMessage('Invalid QR format');
//       }
//     }
//   };

//   const handleCheckout = async () => {
//     const token = localStorage.getItem('token');
//     if (!visitorId) return setMessage('No visitor ID available');

//     try {
//       const res = await fetch(`http://localhost:5000/api/visitor/${visitorId}/checkout`, {
//         method: 'PUT',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();
//       if (res.ok) {
//         setMessage('Visitor checked out successfully');
//       } else {
//         setMessage(data.message || 'Checkout failed');
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage('Server error');
//     }
//   };

//   return (
//     <main className="p-6 max-w-xl mx-auto space-y-4">
//       <h2 className="text-2xl font-bold">Visitor Check-Out</h2>

//       <label className="block">
//         Paste QR Code Data (JSON):
//         <textarea
//           className="mt-2 w-full border p-2 rounded"
//           rows={4}
//           value={qrData}
//           onChange={(e) => {
//             setQrData(e.target.value);
//             try {
//               const parsed = JSON.parse(e.target.value);
//               setVisitorId(parsed.visitorId);
//               setMessage('QR parsed');
//             } catch {
//               setMessage('Invalid QR format');
//             }
//           }}
//         />
//       </label>

//       <p className="text-sm text-gray-600">OR scan below:</p>

//       <QrReader
//         delay={300}
//         onError={(err) => console.error(err)}
//         onScan={handleQRScan}
//         style={{ width: '100%' }}
//       />

//       <Button onClick={handleCheckout} disabled={!visitorId}>
//         Check Out Visitor
//       </Button>

//       {message && <p className="text-blue-600 font-medium">{message}</p>}
//     </main>
//   );
// }


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "../../components/ui/input"
import { Button } from '../../components/ui/button';
import jsQR from 'jsqr';

export default function GuardCheckoutPage() {
  const [qrData, setQrData] = useState('');
  const [visitorId, setVisitorId] = useState('');
  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const router = useRouter();

  const handleQRCodeImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    const reader = new FileReader();

    reader.onload = function (event) {
      img.src = event.target.result;
      setImagePreview(img.src);
    };

    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

      if (qrCode) {
        try {
          const parsed = JSON.parse(qrCode.data);
          setQrData(qrCode.data);
          setVisitorId(parsed.visitorId);
          setMessage('QR Code read successfully');
        } catch {
          setMessage('Invalid QR content');
        }
      } else {
        setMessage('QR Code not detected');
      }
    };

    reader.readAsDataURL(file);
  };

  const handleManualPaste = (e) => {
    const value = e.target.value;
    setQrData(value);
    try {
      const parsed = JSON.parse(value);
      setVisitorId(parsed.visitorId);
      setMessage('QR parsed');
    } catch {
      setVisitorId('');
      setMessage('Invalid QR format');
    }
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    if (!visitorId) return setMessage('No visitor ID available');

    try {
      // const res = await fetch(`http://localhost:5000/api/visitors/${visitorId}/checkout`, {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/visitors/${visitorId}/checkout`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Visitor checked out successfully');
      } else {
        setMessage(data.message || 'Checkout failed');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Server error');
    }
  };

    return (
        <main className="w-full h-screen bg-neutral-600 flex items-center justify-center">
        <div className="w-1/3 bg-slate-100 p-6 border-2 border-neutral-700 rounded-xl flex flex-col items-center justify-center gap-5">
            <h2 className="text-2xl font-semibold">Visitor Check-Out</h2>
    
            <Input
                value={qrData}
                onChange={handleManualPaste}
                placeholder="Paste QR code string"
            />
    
            <div className="text-md font-semibold text-black">OR</div>
            <label for="uploadqr" className='p-2 border-2 border-neutral-600 border-dashed rounded-xl font-semibold tracking-tighter cursor-pointer bg-white hover:bg-gray-100 transition'>Upload Qr Image</label>
            <input id='uploadqr' type="file" accept="image/*" className='hidden' onChange={handleQRCodeImage} />
            
          

    
            {imagePreview && (
            <img src={imagePreview} className="w-32 h-32 object-contain" alt="QR preview" />
            )}
    
            {message && <p className="text-blue-600">{message}</p>}
    
            <div className="flex gap-4 mt-2">
            <Button onClick={handleCheckout} disabled={!visitorId}>
                Check Out
            </Button>
            <Button onClick={() => router.push('/guard')}>Return Home</Button>
            </div>
        </div>
        </main>
    );
  
}
