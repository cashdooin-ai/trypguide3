import React from 'react';
import FlightSearch from '../components/FlightSearch';
import { Plane, Hotel, Train, Bus, Award, Shield, Clock } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      <FlightSearch />
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose TrypGuide?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
            <p className="text-gray-600">Get the lowest fares guaranteed</p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Booking</h3>
            <p className="text-gray-600">Your data is safe with us</p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
            <p className="text-gray-600">We're here to help anytime</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow">
              <Plane className="w-12 h-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Flights</h3>
              <p className="text-gray-600">Book domestic and international flights</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow">
              <Hotel className="w-12 h-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Hotels</h3>
              <p className="text-gray-600">Find perfect accommodation</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow">
              <Train className="w-12 h-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Trains</h3>
              <p className="text-gray-600">Reserve train tickets easily</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow">
              <Bus className="w-12 h-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Buses</h3>
              <p className="text-gray-600">Travel comfortably by bus</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
