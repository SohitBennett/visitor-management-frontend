
'use client';

import React, { useEffect, useState } from 'react'; // Added React import
import { useRouter } from 'next/navigation';

const LogsPage = () => {
  // State to store the processed logs, where each entry represents a visitor's visit
  // and contains both check-in and check-out times if available.
  const [processedLogs, setProcessedLogs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // const res = await fetch("http://localhost:5000/api/logs", {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          // If the response is not OK, throw an error with the status
          const errorText = await res.text();
          throw new Error(`Failed to fetch logs: ${res.status} - ${errorText}`);
        }

        const rawLogs = await res.json();
        console.log("Raw logs received:", rawLogs);

        // --- Data Processing Logic ---
        // This object will temporarily store visitor visit data,
        // grouping check-ins and check-outs by visitor.
        const visitsMap = {};

        rawLogs.forEach(log => {
          // Ensure log.visitor and log.visitor._id exist
          if (!log.visitor || !log.visitor._id) {
            console.warn("Skipping log due to missing visitor or visitor ID:", log);
            return;
          }

          const visitorId = log.visitor._id;

          // If this is the first time we encounter this visitor, initialize their entry
          if (!visitsMap[visitorId]) {
            visitsMap[visitorId] = {
              _id: visitorId, // Using visitor's ID as the unique key for the row
              fullName: log.visitor.fullName,
              checkInTime: log.visitor.checkInTime, // Will store the timestamp of check-in
              checkOutTime: log.visitor.checkOutTime, // Will store the timestamp of check-out
              lastAction: log.action, // Added to store the last action for this visitor
              // You might add other visitor details here if you want them in the table row
              email: log.visitor.email,
              contactInfo: log.visitor.contactInfo,
            };
          }


          visitsMap[visitorId].lastAction = log.action;
        });

        // Convert the map of visits into an array for rendering
        const finalLogsToDisplay = Object.values(visitsMap);
        setProcessedLogs(finalLogsToDisplay);
        console.log("Processed logs for display:", finalLogsToDisplay);

      } catch (err) {
        console.error("Failed to fetch or process logs:", err);
        // Optionally, display an error message to the user
      }
    };
    fetchLogs();
  }, [router]); // Add router to dependency array as it's used inside useEffect

  // Helper function to format UTC dates to IST
  const formatToIST = (utcDate) => {
    if (!utcDate) return '—'; // Return placeholder if date is null/undefined
    const date = new Date(utcDate);
    // Check if the date is valid before formatting
    if (isNaN(date.getTime())) {
      console.warn("Invalid date provided for formatting:", utcDate);
      return 'Invalid Date';
    }
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Visitor Entry/Exit Logs</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="py-3 px-4 border-b border-gray-300 text-left">Visitor Name</th>
              <th className="py-3 px-4 border-b border-gray-300 text-left">Email</th>
              <th className="py-3 px-4 border-b border-gray-300 text-left">Contact Info</th>
              <th className="py-3 px-4 border-b border-gray-300 text-left">Check-In Time</th>
              <th className="py-3 px-4 border-b border-gray-300 text-left">Check-Out Time</th>
              <th className="py-3 px-4 border-b border-gray-300 text-left">Action</th> 
              
            </tr>
          </thead>
          <tbody>
            {processedLogs.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-4 px-4 text-center text-gray-500"> {/* Updated colspan */}
                  {/* Display a loading message or 'No logs' message */}
                  Loading logs... or No logs found.
                </td>
              </tr>
            ) : (
              processedLogs.map((log) => (
                <tr key={log._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-800">{log.fullName}</td>
                  <td className="py-3 px-4 text-gray-600">{log.email || 'N/A'}</td>
                  <td className="py-3 px-4 text-gray-600">{log.contactInfo || 'N/A'}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {formatToIST(log.checkInTime)}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {formatToIST(log.checkOutTime)}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{log.lastAction || 'N/A'}</td> 
                  
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <button
        className="mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300"
        onClick={() => router.back()}
      >
        Go Back
      </button>
    </div>
  );
};

export default LogsPage;
