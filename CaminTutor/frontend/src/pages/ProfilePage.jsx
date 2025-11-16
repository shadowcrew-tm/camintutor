import React, { useState, useEffect } from 'react';
import API from '../services/api';

const ProfilePage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        setLoading(true);
        // This endpoint is protected by our authMiddleware on the backend
        // and our api.js interceptor attaches the token automatically
        const response = await API.get('/bookings/user');
        setBookings(response.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, []);

  if (loading) {
    return <div className="text-center">Loading your bookings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      <div className="bg-white shadow-lg rounded-lg border border-gray-200">
        <ul className="divide-y divide-gray-200">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <li key={booking.id} className="p-4">
                <h2 className="text-xl font-semibold text-blue-600">{booking.dorm_name}</h2>
                <p className="text-gray-700">Room Number: {booking.room_number}</p>
                <p className="text-gray-600">
                  From: {new Date(booking.date_from).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  To: {new Date(booking.date_to).toLocaleDateString()}
                </p>
                <p className="text-gray-500 capitalize">
                  Status: <span className="font-medium text-gray-800">{booking.status}</span>
                </p>
              </li>
            ))
          ) : (
            <li className="p-4 text-center text-gray-500">
              You have no bookings.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProfilePage;