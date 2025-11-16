import React from 'react';
import useAuth from '../hooks/useAuth';

// This component receives a 'room' object as a prop
const RoomCard = ({ room, onBook }) => {
  const { user } = useAuth();

  const handleBookClick = () => {
    // In a real app, you'd open a modal here to select dates
    // For now, we'll just call the onBook function
    if (!user) {
      alert("Please log in to book a room."); // Later, this would be a redirect or modal
      return;
    }
    onBook(room.id);
  };

  return (
    <div className="bg-gray-50 p-4 shadow rounded-lg border border-gray-200 flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Room {room.room_number}</h3>
        <p className="text-gray-600">Capacity: {room.capacity} person(s)</p>
        <p className="text-lg font-bold text-blue-600 mt-2">${room.price} / month</p>
      </div>
      <div>
        <button
          onClick={handleBookClick}
          disabled={room.availability_status !== 'available'}
          className={`px-5 py-2 rounded-md font-medium text-white transition-colors duration-300 ${
            room.availability_status === 'available'
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {room.availability_status === 'available' ? 'Book Now' : 'Booked'}
        </button>
      </div>
    </div>
  );
};

export default RoomCard;