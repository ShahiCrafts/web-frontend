import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function DetailsForm({ onBack, onContinue }) {
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('citizen');

  return (
    <div className="w-full lg:w-1/2 px-6 py-8 lg:px-12 lg:py-10 md:px-8 md:py-24 flex flex-col justify-center min-h-[550px]">
      <div className="w-full max-w-sm md:max-w-md mx-auto">
        <div className="text-sm text-gray-500 mb-4 flex items-center space-x-2">
          <span className="w-2 h-2 bg-orange-500 rounded-full inline-block"></span>
          <span>Step 2 of 3</span>
        </div>

        <h2 className="text-lg sm:text-xl font-bold mb-1.5">Tell us about yourself</h2>
        <p className="text-gray-500 mb-5 text-sm">
          We need a few more details to set up your account
        </p>

        <div className="mb-[1.1rem] text-left">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 focus:ring-blue-200 rounded-lg text-base focus:outline-none focus:ring-1"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select your role</label>

          <div
            onClick={() => setRole('citizen')}
            className={`cursor-pointer p-4 border rounded-lg mb-4 flex items-start space-x-3 hover:bg-gray-50 ${role === 'citizen' ? 'border-orange-200 bg-orange-50' : 'border-gray-300'}`}
          >
            <input
              type="radio"
              id="citizen"
              name="role"
              value="citizen"
              checked={role === 'citizen'}
              onChange={() => setRole('citizen')}
              className="mt-1 accent-orange-400"
            />
            <div>
              <label htmlFor="citizen" className="font-medium text-gray-800 block cursor-pointer">
                Citizen
              </label>
              <p className="text-sm text-gray-500">General public access and services</p>
            </div>
          </div>

          <div
            onClick={() => setRole('official')}
            className={`cursor-pointer p-4 border rounded-lg flex items-start space-x-3 hover:bg-gray-50 ${role === 'official' ? 'border-orange-200 bg-orange-50' : 'border-gray-300'}`}
          >
            <input
              type="radio"
              id="official"
              name="role"
              value="official"
              checked={role === 'official'}
              onChange={() => setRole('official')}
              className="mt-1 accent-orange-400"
            />
            <div>
              <label htmlFor="official" className="font-medium text-gray-800 block cursor-pointer">
                Official
              </label>
              <p className="text-sm text-gray-500">Government and administrative access</p>
            </div>
          </div>
        </div>

        {/* Spacer to match visual height */}
        <div className="h-[1.778rem] md:h-[1.7rem" />

        <div className="flex gap-3">
          <button
            onClick={onBack}
            type="button"
            className="flex items-center justify-center w-1/2 px-4 py-1 cursor-pointer border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <button
            onClick={() => onContinue({ fullName, role })}
            type="button"
            className="w-1/2 px-4 py-2 bg-orange-500 text-white cursor-pointer rounded-lg hover:bg-orange-600 transition"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
