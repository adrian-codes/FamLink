'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function CreateFamily() {
  const { token, user, family } = useAuth();
  const router = useRouter();
  const [familyName, setFamilyName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!token || !user) {
      router.push('/login');
    } else if (family) {
      router.push('/dashboard');
    }
  }, [token, user, family, router]);

  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8000/families/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: familyName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create family');
      }

      setSuccess('Family created successfully!');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!token || !user) {
    return null;
  }

  if (family) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-gray-900 text-center">Create a New Family</h1>
      <p className="mt-4 text-lg text-gray-600 text-center">Enter a name for your family to get started.</p>

      {error && <div className="mt-4 bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>}
      {success && <div className="mt-4 bg-green-50 text-green-700 p-4 rounded-lg">{success}</div>}

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
        <form onSubmit={handleCreateFamily} className="space-y-4">
          <div>
            <label htmlFor="family_name" className="block text-sm font-medium text-gray-700">Family Name</label>
            <input
              id="family_name"
              type="text"
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:bg-blue-700 hover:scale-105 transition-transform duration-200"
          >
            Create Family
          </button>
        </form>
      </div>
    </div>
  );
}