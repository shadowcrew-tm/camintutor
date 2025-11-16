import React, { useState, useEffect } from 'react';
import API from '../services/api.js';
import DormCard from '../components/DormCard.jsx';

const HomePage = () => {
  const [universities, setUniversities] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [dorms, setDorms] = useState([]);
  
  const [selectedUni, setSelectedUni] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [loadingFaculties, setLoadingFaculties] = useState(false);
  const [loadingDorms, setLoadingDorms] = useState(false);

  // 1. Fetch all universities on component mount
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setLoading(true);
        const response = await API.get('/universities');
        setUniversities(response.data);
      } catch (err) {
        console.error("Error fetching universities:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUniversities();
  }, []);

  // 2. Fetch faculties when a university is selected
  useEffect(() => {
    if (!selectedUni) {
      setFaculties([]);
      setDorms([]);
      setSelectedFaculty('');
      return;
    }

    const fetchFaculties = async () => {
      try {
        setLoadingFaculties(true);
        setDorms([]);
        setSelectedFaculty('');
        const response = await API.get(`/faculties?university_id=${selectedUni}`);
        setFaculties(response.data);
      } catch (err) {
        console.error("Error fetching faculties:", err);
      } finally {
        setLoadingFaculties(false);
      }
    };

    fetchFaculties();
  }, [selectedUni]);

  // 3. Fetch dorms when a faculty is selected
  useEffect(() => {
    if (!selectedFaculty) {
      setDorms([]);
      return;
    }

    const fetchDorms = async () => {
      try {
        setLoadingDorms(true);
        const response = await API.get(`/dorms?faculty_id=${selectedFaculty}`);
        setDorms(response.data);
      } catch (err) {
        console.error("Error fetching dorms:", err);
      } finally {
        setLoadingDorms(false);
      }
    };

    fetchDorms();
  }, [selectedFaculty]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Găsește-ți Căminul</h1>
      
      {/* Selection Dropdowns */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* University Selector */}
        <div className="flex-1">
          <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
            Universitate
          </label>
          <select
            id="university"
            value={selectedUni}
            onChange={(e) => setSelectedUni(e.target.value)}
            className="w-full p-2 border rounded-md shadow-sm"
            disabled={loading}
          >
            <option value="">Alege o universitate</option>
            {universities.map((uni) => (
              <option key={uni.id} value={uni.id}>{uni.name}</option>
            ))}
          </select>
        </div>

        {/* Faculty Selector */}
        <div className="flex-1">
          <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 mb-1">
            Facultate
          </label>
          <select
            id="faculty"
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            className="w-full p-2 border rounded-md shadow-sm"
            disabled={!selectedUni || loadingFaculties}
          >
            <option value="">Alege o facultate</option>
            {faculties.map((faculty) => (
              <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Dorms List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Cămine Disponibile</h2>
        {loadingDorms && <div className="text-center">Loading dorms...</div>}
        
        {!loadingDorms && dorms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dorms.map((dorm) => (
              <DormCard key={dorm.id} dorm={dorm} />
            ))}
          </div>
        )}

        {!loadingDorms && dorms.length === 0 && selectedFaculty && (
          <p className="text-gray-500">Nu au fost găsite cămine pentru facultatea selectată.</p>
        )}

        {!selectedFaculty && !loading && (
          <p className="text-gray-500">Te rugăm să selectezi o universitate și o facultate pentru a vedea căminele.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;