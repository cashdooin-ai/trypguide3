import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Users, Plane } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const FlightSearch = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState('one-way');
  const [searchData, setSearchData] = useState({
    from: 'DEL',
    to: 'BOM',
    departureDate: new Date(),
    returnDate: null,
    adults: 1,
    children: 0,
    infants: 0,
    cabinClass: 'economy'
  });

  const airports = [
    { code: 'DEL', city: 'Delhi' },
    { code: 'BOM', city: 'Mumbai' },
    { code: 'BLR', city: 'Bangalore' },
    { code: 'MAA', city: 'Chennai' },
    { code: 'HYD', city: 'Hyderabad' },
    { code: 'CCU', city: 'Kolkata' },
    { code: 'GOI', city: 'Goa' },
    { code: 'COK', city: 'Kochi' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams({
      from: searchData.from,
      to: searchData.to,
      departureDate: searchData.departureDate.toISOString().split('T')[0],
      ...(tripType === 'round-trip' && searchData.returnDate && {
        returnDate: searchData.returnDate.toISOString().split('T')[0]
      }),
      adults: searchData.adults,
      children: searchData.children,
      infants: searchData.infants,
      cabinClass: searchData.cabinClass,
      tripType
    }).toString();
    navigate(`/flights/search?${query}`);
  };

  const totalPassengers = searchData.adults + searchData.children + searchData.infants;

  return (
    <div className="bg-gradient-to-br from-primary-600 to-primary-800 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Find Your Next Adventure
        </h1>

        <div className="bg-white rounded-2xl shadow-2xl p-6">
          {/* Trip Type Selector */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setTripType('one-way')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                tripType === 'one-way'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              One Way
            </button>
            <button
              onClick={() => setTripType('round-trip')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                tripType === 'round-trip'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Round Trip
            </button>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            {/* From/To Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Plane className="inline w-4 h-4 mr-1" />
                  From
                </label>
                <select
                  value={searchData.from}
                  onChange={(e) => setSearchData({ ...searchData, from: e.target.value })}
                  className="input-field"
                  required
                >
                  {airports.map((airport) => (
                    <option key={airport.code} value={airport.code}>
                      {airport.city} ({airport.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Plane className="inline w-4 h-4 mr-1 transform rotate-90" />
                  To
                </label>
                <select
                  value={searchData.to}
                  onChange={(e) => setSearchData({ ...searchData, to: e.target.value })}
                  className="input-field"
                  required
                >
                  {airports.map((airport) => (
                    <option key={airport.code} value={airport.code}>
                      {airport.city} ({airport.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Departure Date
                </label>
                <DatePicker
                  selected={searchData.departureDate}
                  onChange={(date) => setSearchData({ ...searchData, departureDate: date })}
                  minDate={new Date()}
                  dateFormat="dd MMM yyyy"
                  className="input-field"
                  required
                />
              </div>

              {tripType === 'round-trip' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Return Date
                  </label>
                  <DatePicker
                    selected={searchData.returnDate}
                    onChange={(date) => setSearchData({ ...searchData, returnDate: date })}
                    minDate={searchData.departureDate}
                    dateFormat="dd MMM yyyy"
                    className="input-field"
                    required={tripType === 'round-trip'}
                  />
                </div>
              )}
            </div>

            {/* Passengers and Class Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="inline w-4 h-4 mr-1" />
                  Passengers ({totalPassengers})
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    min="1"
                    max="9"
                    value={searchData.adults}
                    onChange={(e) => setSearchData({ ...searchData, adults: parseInt(e.target.value) })}
                    className="input-field w-1/3"
                    placeholder="Adults"
                  />
                  <input
                    type="number"
                    min="0"
                    max="9"
                    value={searchData.children}
                    onChange={(e) => setSearchData({ ...searchData, children: parseInt(e.target.value) })}
                    className="input-field w-1/3"
                    placeholder="Children"
                  />
                  <input
                    type="number"
                    min="0"
                    max="9"
                    value={searchData.infants}
                    onChange={(e) => setSearchData({ ...searchData, infants: parseInt(e.target.value) })}
                    className="input-field w-1/3"
                    placeholder="Infants"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cabin Class
                </label>
                <select
                  value={searchData.cabinClass}
                  onChange={(e) => setSearchData({ ...searchData, cabinClass: e.target.value })}
                  className="input-field"
                >
                  <option value="economy">Economy</option>
                  <option value="premium-economy">Premium Economy</option>
                  <option value="business">Business</option>
                  <option value="first">First Class</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Search Flights</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FlightSearch;
