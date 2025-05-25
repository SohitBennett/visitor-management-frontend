// 'use client'

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Input } from "../../components/ui/input"
// import { Button } from "../../components/ui/button"

// export default function QRCheckinPage() {
//   const [qrCode, setQrCode] = useState('');
//   const router = useRouter();

//   const handleCheckIn = async () => {
//     const res = await fetch(`http://localhost:5000/api/visitors/checkin/qrcode`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${localStorage.getItem('token')}`,
//       },
//       body: JSON.stringify({ qrString: qrCode }),
//     });

//     if (res.ok) {
//       alert("Checked in successfully!");
//       router.push("/guard");
//       //push to badge generation.
//     } else {
//       alert("Invalid QR or error occurred");
//     }
//   };

//   return (
//     <main className="w-full h-screen flex items-center justify-center">
//       <div className="w-1/3 h-1/2 border-2 border-neutral-700 rounded-xl flex flex-col items-center justify-center gap-5">
//         <h2 className="text-2xl font-semibold">QR Check-in</h2>
//         <div>
//           <Input
//             value={qrCode}
//             onChange={(e) => setQrCode(e.target.value)}
//             placeholder="Enter QR code string"
//           />
//         </div>  
//         <div className="flex gap-10">
//           <Button onClick={handleCheckIn}>Check In</Button>
//           <Button onClick={() => router.push('/guard')}>Return Home</Button>
//         </div>  
//       </div>  
//     </main>
//   );
// }


'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import jsQR from "jsqr"

export default function QRCheckinPage() {
  const [qrCode, setQrCode] = useState('');
  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const router = useRouter();

  const handleCheckIn = async () => {
    try {
      const payload = {
        qrCodeData: qrCode // this should already be a stringified JSON
      };
  
      // const res = await fetch(`http://localhost:5000/api/visitors/checkin/qrcode`, {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/visitors/checkin/qrcode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
      if (res.ok) {
        alert("✅ Checked in successfully!");
        router.push("/guard");
      } else {
        alert(data.message || "❌ Invalid QR or error occurred");
      }
    } catch (err) {
      alert("❌ Something went wrong.");
    }
  };
  

  const handleQRCodeImage = (e) => {
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
      const qrCodeResult = jsQR(imageData.data, canvas.width, canvas.height);

      if (qrCodeResult) {
        setQrCode(qrCodeResult.data);
        setMessage("✅ QR Code decoded from image.");
      } else {
        setMessage("❌ No QR code detected in image.");
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <main className="w-full h-screen flex items-center justify-center">
      <div className="w-1/3 p-6 border-2 border-neutral-700 rounded-xl flex flex-col items-center justify-center gap-5">
        <h2 className="text-2xl font-semibold">QR Check-in</h2>

        <Input
          value={qrCode}
          onChange={(e) => setQrCode(e.target.value)}
          placeholder="Paste QR code string"
        />

        {/* <div className="text-sm text-gray-600">OR upload QR image:</div>
        <input type="file" accept="image/*" onChange={handleQRCodeImage} /> */}

          <div className="text-md font-semibold text-black">OR</div>
          <label for="uploadqr" className='p-2 border-2 border-neutral-600 border-dashed rounded-xl font-semibold tracking-tighter cursor-pointer bg-white hover:bg-gray-100 transition'>Upload Qr Image</label>
          <input id='uploadqr' type="file" accept="image/*" className='hidden' onChange={handleQRCodeImage} />

        {imagePreview && <img src={imagePreview} className="w-32 h-32 object-contain" alt="QR preview" />}

        {message && <p className="text-blue-600">{message}</p>}

        <div className="flex gap-4 mt-2">
          <Button onClick={handleCheckIn} disabled={!qrCode}>
            Check In
          </Button>
          <Button onClick={() => router.push('/guard')}>Return Home</Button>
        </div>
      </div>
    </main>
  );
}
