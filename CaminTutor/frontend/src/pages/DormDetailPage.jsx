import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api.js';
import RoomCard from '../components/RoomCard.jsx';
import useAuth from '../hooks/useAuth.js';

const DormDetailPage = () => {
  const { id } = useParams(); // Gets the ':id' from the URL
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dorm, setDorm] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // States for new review
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    fetchDormDetails();
  }, [id]);

  const fetchDormDetails = async () => {
    try {
      setLoading(true);
      // 1. Fetch the specific dorm's details (now includes faculties and reviews)
      const dormRes = await API.get(`/dorms/${id}`);
      setDorm(dormRes.data);

      // 2. Fetch the rooms for this dorm
      const roomsRes = await API.get(`/rooms?dorm_id=${id}`);
      setRooms(roomsRes.data);
    } catch (err) {
      console.error("Error fetching dorm details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (roomId) => {
    if (!user) {
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }

    try {
      const bookingData = {
        room_id: roomId,
        date_from: '2025-09-01', // Example date
        date_to: '2026-06-01',   // Example date
      };
      
      await API.post('/bookings', bookingData);
      
      setMessage('Booking successful!');
      
      // Update the room's availability in the UI
      setRooms(rooms.map(room => 
        room.id === roomId ? { ...room, availability_status: 'booked' } : room
      ));

    } catch (err) {
      console.error("Booking failed:", err);
      setMessage('Booking failed. The room might have just been taken.');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
        navigate('/login');
        return;
    }
    try {
        const res = await API.post('/reviews', {
            dorm_id: id,
            rating: reviewRating,
            comment: reviewComment
        });
        // Add new review to the top of the list and clear form
        setDorm({
            ...dorm,
            reviews: [{...res.data, email: user.email}, ...dorm.reviews.filter(r => r.user_id !== user.id)]
        });
        setReviewComment('');
        setReviewRating(5);
        setMessage('Review submitted successfully!');
    } catch (err) {
        console.error("Error submitting review:", err);
        setMessage('Failed to submit review.');
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!dorm) {
    return <div className="text-center">Dorm not found.</div>;
  }

  return (
    <div>
      {message && <p className="bg-green-100 text-green-800 p-3 rounded-md mb-4">{message}</p>}

      <div className="bg-white shadow-lg rounded-lg p-8 mb-8 border border-gray-200">
        {/* Pictures */}
        {dorm.pictures && dorm.pictures.length > 0 ? (
          <img 
            src={dorm.pictures[0]} 
            alt={dorm.name} 
            className="w-full h-96 object-cover rounded-lg mb-6"
            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/1200x400/e2e8f0/64748b?text=Imagine+Indisponibila'; }}
          />
        ) : (
          <img 
            src="https://placehold.co/1200x400/e2e8f0/64748b?text=CaminTutor" 
            alt="Placeholder" 
            className="w-full h-96 object-cover rounded-lg mb-6"
          />
        )}
        
        <h1 className="text-4xl font-bold mb-4">{dorm.name}</h1>
        <p className="text-xl text-gray-600 mb-4">{dorm.address}</p>
        <p className="text-gray-700 mb-6">{dorm.description}</p>
        
        {/* Associated Faculties */}
        {dorm.faculties && dorm.faculties.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Facultăți Arondate</h3>
            <div className="flex flex-wrap gap-2">
              {dorm.faculties.map(faculty => (
                <span key={faculty.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {faculty.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tips & Tricks */}
        {dorm.tips && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Tips & Tricks</h3>
            <p className="text-gray-700 whitespace-pre-line">{dorm.tips}</p>
          </div>
        )}
      </div>

      {/* Rooms */}
      <h2 className="text-3xl font-bold mb-6">Camere Disponibile</h2>
      <div className="space-y-4 mb-12">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <RoomCard key={room.id} room={room} onBook={handleBooking} />
          ))
        ) : (
          <p>Nicio cameră găsită pentru acest cămin.</p>
        )}
      </div>

      {/* Reviews Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Recenzii</h2>
        
        {/* Submit Review Form */}
        {user && (
          <form onSubmit={handleReviewSubmit} className="bg-white p-6 shadow-lg rounded-lg border border-gray-200 mb-8">
            <h3 className="text-xl font-semibold mb-4">Lasă o recenzie</h3>
            <div className="mb-4">
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">Notă (1-5)</label>
              <select 
                id="rating"
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="w-full p-2 border rounded-md shadow-sm"
              >
                <option value={5}>5 Stele</option>
                <option value={4}>4 Stele</option>
                <option value={3}>3 Stele</option>
                <option value={2}>2 Stele</option>
                <option value={1}>1 Stea</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Comentariu</label>
              <textarea
                id="comment"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows="4"
                className="w-full p-2 border rounded-md shadow-sm"
                placeholder="Spune-ne părerea ta..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors duration-300"
            >
              Trimite Recenzia
            </button>
          </form>
        )}

        {/* Display Reviews */}
        <div className="space-y-4">
          {dorm.reviews && dorm.reviews.length > 0 ? (
            dorm.reviews.map(review => (
              <div key={review.id} className="bg-white p-4 shadow rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-800">{review.email}</span>
                  <span className="text-yellow-500 font-bold">{review.rating} / 5 Stele</span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p>Nicio recenzie pentru acest cămin încă.</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default DormDetailPage;