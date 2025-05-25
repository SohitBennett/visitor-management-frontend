// 'use client'

// import { useEffect, useState, useRef } from 'react';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

// const BadgePage = () => {
//   const [visitor, setVisitor] = useState(null);
//   const badgeRef = useRef();

//   useEffect(() => {
//     const stored = localStorage.getItem('lastCheckedInVisitor');
//     if (stored) {
//       setVisitor(JSON.parse(stored));
//     }
//   }, []);

//   const generatePDF = async () => {
//     const canvas = await html2canvas(badgeRef.current);
//     const imgData = canvas.toDataURL('image/png');

//     const pdf = new jsPDF({
//       orientation: 'portrait',
//       unit: 'px',
//       format: [300, 400],
//     });

//     pdf.addImage(imgData, 'PNG', 10, 10);
//     pdf.save(`${visitor?.fullName}_badge.pdf`);
//   };

//   if (!visitor) {
//     return <div className="text-center mt-10 text-xl font-bold">No visitor data found.</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-[320px] text-center" ref={badgeRef}>
//         <h2 className="text-xl font-bold mb-4 border-b pb-2">Visitor Badge</h2>
        
//         <div className="mb-3">
//           <img
//             src={visitor.imageURL || '/placeholder.jpg'}
//             alt="Visitor"
//             className="w-24 h-24 rounded-full mx-auto border object-cover"
//           />
//         </div>

//         <div className="mb-3">
//           <strong className="block">Name:</strong>
//           <span>{visitor.fullName}</span>
//         </div>

//         <div className="mb-3">
//           <strong className="block">Email:</strong>
//           <span>{visitor.email}</span>
//         </div>

//         <div className="mb-3">
//           <strong className="block">Phone:</strong>
//           <span>{visitor.contactInfo}</span>
//         </div>

//         <div className="mb-3">
//           <strong className="block">Purpose:</strong>
//           <span>{visitor.purpose}</span>
//         </div>

//         <div className="mb-3">
//           <strong className="block">Organization:</strong>
//           <span>{visitor.organization}</span>
//         </div>

//         <div className="mt-4">
//           <img
//             src="/qr-placeholder.png"
//             alt="QR Code"
//             className="mx-auto w-20 h-20 border"
//           />
//           <p className="text-xs text-gray-500 mt-1">QR Code</p>
//         </div>
//       </div>

//       <div className="ml-10">
//         <button
//           onClick={generatePDF}
//           className="bg-green-600 text-white font-semibold px-6 py-2 rounded hover:bg-green-700 transition"
//         >
//           Download PDF
//         </button>
//       </div>
//     </div>
//   );
// };

// export default BadgePage;

'use client'

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const BadgePage = () => {
  const [visitor, setVisitor] = useState(null);
  const [qrImage, setQrImage] = useState(null);
  const badgeRef = useRef();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');


  useEffect(() => {
    if (!id) return;
    // Fetch latest checked-in visitor
    const fetchLastCheckedInVisitor = async () => {
      const token = localStorage.getItem('token');
      try {
        // const res = await fetch(`http://localhost:5000/api/visitors/status/${id}`, {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/visitors/status/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        setVisitor(data.visitor);

        if (data.visitor.qrCode) {
            const qr = await QRCode.toDataURL(data.visitor.qrCode);
            setQrImage(qr);
        }

        console.log(data);
      } catch (err) {
        console.error("Error fetching badge data", err);
      }
    };

    fetchLastCheckedInVisitor();
  }, [id]);

  const generatePDF = async () => {
    const canvas = await html2canvas(badgeRef.current);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [400, 600],
    });

    pdf.addImage(imgData, 'PNG', 10, 10);
    pdf.save(`${visitor?.fullName}_badge.pdf`);
  };

  if (!visitor) return <div className="text-center mt-10 text-xl font-bold">Loading Badge...</div>;



  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4 gap-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[320px] text-center" ref={badgeRef}>
        <h2 className="text-xl font-bold tracking-tighter mb-4 border-b pb-2">Visitor Badge</h2>
        
        <div className="mb-3">
          <img
            // src={`http://localhost:5000/${visitor.photo}` || '/placeholder.jpg'}
            src={`${process.env.NEXT_PUBLIC_API_URL}/${visitor.photo}` || '/placeholder.jpg'}
            alt="Visitor"
            className="w-24 h-24 rounded-full mx-auto border object-cover"
          />
        </div>

        <div className="mb-3 text-xl tracking-tighter flex items-center justify-center gap-2">
          <strong className="font-semibold block">Name: </strong> 
          <span >{visitor.fullName}</span>
        </div>

        <div className="mb-3 text-xl tracking-tighter flex items-center justify-center gap-2">
          <strong className="font-semibold block">Email:</strong>
          <span>{visitor.email}</span>
        </div>

        <div className="mb-3 text-xl tracking-tighter flex items-center justify-center gap-2">
          <strong className="font-semibold block">Phone:</strong>
          <span>{visitor.contactInfo}</span>
        </div>

        <div className="mb-3 text-xl tracking-tighter flex items-center justify-center gap-2">
          <strong className="font-semibold block">Purpose:</strong>
          <span>{visitor.purpose}</span>
        </div>

        <div className="mb-3 text-xl tracking-tighter flex items-center justify-center gap-2">
          <strong className="font-semibold block">Organization:</strong>
          <span>{visitor.organization}</span>
        </div>

        <div className="mt-4">
            {qrImage ? (
              <img
                src={qrImage}
                alt="QR Code"
                className="mx-auto w-[10vw] h-[10vw] border"
              />
            ) : (
              <p>Generating QR...</p>
            )}
            <p className="text-xs text-gray-500 mt-1">QR Code</p>
        </div>
      </div>

      <div className="ml-10 flex flex-col gap-5">
        <button
          onClick={generatePDF}
          className="bg-green-600 text-white font-semibold tracking-tighter px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Download PDF
        </button>
        <button
          onClick={() => router.push('/guard')}
          className="bg-blue-600 text-white font-semibold tracking-tighter px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Return Home
        </button>
      </div>
    </div>
  );
};

export default BadgePage;
