import React from 'react';

const ContactPage = () => {
  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg border border-gray-200">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Contactează-ne
      </h1>
      <p className="text-gray-700 text-lg text-center mb-6">
        Ai întrebări? Suntem aici să te ajutăm.
      </p>
      <div className="space-y-4">
        <div className="text-gray-800">
          <span className="font-semibold">Email:</span>
          <a
            href="mailto:support@camintutor.com"
            className="ml-2 text-blue-600 hover:underline"
          >
            support@camintutor.com
          </a>
        </div>
        <div className="text-gray-800">
          <span className="font-semibold">Telefon:</span>
          <span className="ml-2 text-gray-700">+40 (234) 567-890</span>
        </div>
        <div className="text-gray-800">
          <span className="font-semibold">Adresă:</span>
          <span className="ml-2 text-gray-700">
            Str. Universității Nr. 1, Timișoara
          </span>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;