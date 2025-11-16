import React from 'react';
import { Link } from 'react-router-dom';

const DormCard = ({ dorm }) => {
  // The backend now sends 'available_places_count'
  const availablePlaces = parseInt(dorm.available_places_count, 10);

  return (
    <div className="bg-white p-4 shadow rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col">
      {/* Use a placeholder image if no pictures are available */}
      <img 
        src={dorm.pictures && dorm.pictures.length > 0 ? dorm.pictures[0] : 'https://placehold.co/600x400/e2e8f0/64748b?text=CaminTutor'}
        alt={dorm.name}
        className="w-full h-48 object-cover mb-4 rounded"
        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/e2e8f0/64748b?text=Imagine+Indisponibila'; }}
      />
      
      <div className="p-4 flex-grow flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{dorm.name}</h2>
        <p className="text-gray-500 mb-4">{dorm.address}</p>
        <p className="text-gray-700 text-sm mb-4 truncate flex-grow">{dorm.description}</p>
        
        {/* Display available places */}
        <div className="mb-4">
          <span className="font-semibold text-lg">
            {availablePlaces > 0 
              ? `${availablePlaces} locuri disponibile` 
              : 'Niciun loc disponibil'}
          </span>
        </div>
        
        <Link to={`/dorms/${dorm.id}`} className="mt-auto">
          <button className="w-full bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors duration-300">
            Vezi Detalii
          </button>
        </Link>
      </div>
    </div>
  );
};

export default DormCard;