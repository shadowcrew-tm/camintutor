import React, { useState, useEffect } from 'react';
import API from '../services/api.js';

const AdminDashboard = () => {
  const [dorms, setDorms] = useState([]);
  
  // State for "Create Dorm" form
  const [dormName, setDormName] = useState('');
  const [dormAddress, setDormAddress] = useState('');
  const [dormDesc, setDormDesc] = useState('');
  const [dormPictures, setDormPictures] = useState(''); // Comma-separated URLs
  const [dormTips, setDormTips] = useState('');
  
  // State for "Create Room" form
  const [selectedDorm, setSelectedDorm] = useState('');
  const [roomNum, setRoomNum] = useState('');
  const [roomPrice, setRoomPrice] = useState('');
  const [roomCap, setRoomCap] = useState(1);
  
  const [message, setMessage] = useState('');

  // Fetch all dorms so we can add rooms to them
  useEffect(() => {
    fetchDorms();
  }, []);

  const fetchDorms = async () => {
    try {
      const res = await API.get('/dorms');
      setDorms(res.data);
      if (res.data.length > 0) {
        setSelectedDorm(res.data[0].id); // Default to the first dorm
      }
    } catch (err) {
      console.error("Error fetching dorms:", err);
    }
  };

  const handleCreateDorm = async (e) => {
    e.preventDefault();
    try {
      // Convert comma-separated string to array
      const picturesArray = dormPictures.split(',').map(url => url.trim()).filter(url => url);

      const res = await API.post('/dorms', { 
        name: dormName, 
        address: dormAddress, 
        description: dormDesc,
        pictures: picturesArray,
        tips: dormTips
      });
      setMessage(`Dorm "${res.data.name}" created successfully!`);
      // Add new dorm to list and clear form
      setDorms([...dorms, res.data]);
      setDormName(''); 
      setDormAddress(''); 
      setDormDesc('');
      setDormPictures('');
      setDormTips('');
    } catch (err) {
      setMessage('Error creating dorm.');
      console.error(err);
    }
  };
  
  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!selectedDorm) {
      setMessage('Please select a dorm first.');
      return;
    }
    try {
      const res = await API.post('/rooms', { 
        dorm_id: selectedDorm, 
        room_number: roomNum, 
        price: roomPrice, 
        capacity: roomCap 
      });
      setMessage(`Room "${res.data.room_number}" created successfully!`);
      // Clear form
      setRoomNum(''); setRoomPrice(''); setRoomCap(1);
    } catch (err) {
      setMessage('Error creating room.');
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      {message && <p className="bg-green-100 text-green-800 p-3 rounded-md mb-4">{message}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create Dorm Form */}
        <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">Create New Dorm</h2>
          <form onSubmit={handleCreateDorm} className="space-y-4">
            <input type="text" value={dormName} onChange={(e) => setDormName(e.target.value)} placeholder="Dorm Name" className="w-full p-2 border rounded-md" required />
            <input type="text" value={dormAddress} onChange={(e) => setDormAddress(e.target.value)} placeholder="Address" className="w-full p-2 border rounded-md" required />
            <textarea value={dormDesc} onChange={(e) => setDormDesc(e.target.value)} placeholder="Description" className="w-full p-2 border rounded-md" />
            <textarea value={dormPictures} onChange={(e) => setDormPictures(e.target.value)} placeholder="Picture URLs (comma-separated)" className="w-full p-2 border rounded-md" />
            <textarea value={dormTips} onChange={(e) => setDormTips(e.target.value)} placeholder="Tips & Tricks" className="w-full p-2 border rounded-md" />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700">Create Dorm</button>
          </form>
        </div>
        
        {/* Create Room Form */}
        <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">Create New Room</h2>
          <form onSubmit={handleCreateRoom} className="space-y-4">
            <select value={selectedDorm} onChange={(e) => setSelectedDorm(e.target.value)} className="w-full p-2 border rounded-md" required>
              <option value="">Select a Dorm</option>
              {dorms.map(dorm => (
                <option key={dorm.id} value={dorm.id}>{dorm.name}</option>
              ))}
            </select>
            <input type="text" value={roomNum} onChange={(e) => setRoomNum(e.target.value)} placeholder="Room Number" className="w-full p-2 border rounded-md" required />
            <input type="number" value={roomPrice} onChange={(e) => setRoomPrice(e.target.value)} placeholder="Price" className="w-full p-2 border rounded-md" required />
            <input type="number" value={roomCap} onChange={(e) => setRoomCap(parseInt(e.target.value))} placeholder="Capacity" className="w-full p-2 border rounded-md" required min="1" />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700">Create Room</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;