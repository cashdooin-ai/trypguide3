import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { flightAPI } from '../services/api';
import { formatCurrency, formatTime, formatStops } from '../utils/helpers';
import { Plane, Clock, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    searchFlights();
  }, [searchParams]);

  const searchFlights = async () => {
    try {
      setLoading(true);
      const params = Object.fromEntries(searchParams);
      const response = await flightAPI.search(params);
      setFlights(response.data.data.outbound || []);
    } catch (error) {
      toast.error('Failed to fetch flights');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          {searchParams.get('from')} → {searchParams.get('to')}
        </h1>

        <div className="space-y-4">
          {flights.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-600">No flights found. Please try different search criteria.</p>
            </div>
          ) : (
            flights.map((flight) => (
              <div key={flight.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{formatTime(flight.departureTime)}</p>
                        <p className="text-sm text-gray-600">{flight.from}</p>
                      </div>

                      <div className="flex-1 text-center">
                        <div className="flex items-center justify-center space-x-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{flight.duration}</span>
                        </div>
                        <div className="border-t-2 border-gray-300 my-2"></div>
                        <p className="text-xs text-gray-500">{formatStops(flight.stops)}</p>
                      </div>

                      <div className="text-center">
                        <p className="text-2xl font-bold">{formatTime(flight.arrivalTime)}</p>
                        <p className="text-sm text-gray-600">{flight.to}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Plane className="w-4 h-4 mr-1" />
                        {flight.airline} {flight.flightNumber}
                      </span>
                      <span>{flight.cabinClass}</span>
                      <span>{flight.baggage.checkin} Baggage</span>
                    </div>
                  </div>

                  <div className="text-right ml-8">
                    <p className="text-3xl font-bold text-primary-600">
                      {formatCurrency(flight.price)}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">per person</p>
                    <button className="btn-primary">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
