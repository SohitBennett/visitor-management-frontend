

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HostDashboard() {
  const [requests, setRequests] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // const res = await fetch("http://localhost:5000/api/visitors/pending", {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/visitors/pending`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch requests");
        const data = await res.json();
        console.log(data)
        setRequests(data.pendingVisitors);
      } catch (error) {
        console.error(error);
        alert("Error fetching requests");
      }
    };

    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    const token = localStorage.getItem("token");
    try {
      // const res = await fetch(`http://localhost:5000/api/visitors/${id}/${action}`, {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/visitors/${id}/${action}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Failed to ${action}`);
      setRequests(prev => prev.filter(r => r._id !== id));
    } catch (error) {
      console.error(error);
      alert(`Error during ${action}`);
    }
  };

  return (
    <div className="bg-neutral-500 w-full h-screen flex items-center justify-center">
        <div className="p-6 bg-neutral-200 rounded-2xl">
        <h1 className="text-2xl font-bold mb-4">CheckIn Approval Requests </h1>
        {console.log(requests)}
        {requests.length === 0 ? (
            <p>No pending visitor requests.</p>
        ) : (
            <table className="min-w-full table-auto border border-gray-200">
            <thead className="bg-gray-100">
                <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Purpose</th>
                <th className="px-4 py-2 border">Scheduled Time</th>
                <th className="px-4 py-2 border">Actions</th>
                </tr>
            </thead>
            <tbody>
                {requests.map((req) => (
                <tr key={req._id} className="text-center">
                    <td className="border px-4 py-2">{req.fullName}</td>
                    <td className="border px-4 py-2">{req.email}</td>
                    <td className="border px-4 py-2">{req.purpose}</td>
                    <td className="border px-4 py-2">{new Date(req.scheduledTime).toLocaleString()}</td>
                    <td className="border px-4 py-2">
                    <button
                        className="bg-green-500 text-white font-semibold tracking-tighter px-4 py-1 rounded-full mr-2 hover:bg-green-600"
                        onClick={() => handleAction(req._id, "approve")}
                    >
                        Approve
                    </button>
                    <button
                        className="bg-red-500 text-white font-semibold tracking-tighter px-4 py-1 rounded-full hover:bg-red-600"
                        onClick={() => handleAction(req._id, "reject")}
                    >
                        Reject
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
        </div>
    </div>    
  );
}
