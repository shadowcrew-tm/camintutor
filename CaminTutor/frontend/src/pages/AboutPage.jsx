import React from 'react';

const AboutPage = () => {
  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg border border-gray-200">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Despre CaminTutor
      </h1>
      <p className="text-gray-700 text-lg mb-4">
        Bun venit la CaminTutor! Misiunea noastră este să facem procesul de
        găsire și rezervare a unui loc în cămin cât mai simplu și
        lipsit de stres.
      </p>
      <p className="text-gray-700 mb-4">
        Platforma centralizează informații despre căminele din Timișoara
        aparținând de UVT, UPT și UMFT.
      </p>
      <p className="text-gray-700 mb-4">
        Aici poți găsi informații legate de procesul de cazare, detalii
        despre camere, facultățile arondate, recenzii de la alți studenți și
        sfaturi utile pentru fiecare cămin.
      </p>
    </div>
  );
};

export default AboutPage;