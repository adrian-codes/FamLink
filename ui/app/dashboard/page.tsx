'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

interface Chore {
  id: number;
  title: string;
  description: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export default function Dashboard() {
  const { token, user, family } = useAuth();
  const router = useRouter();
  const [chores, setChores] = useState<Chore[]>([]);
  const [newChore, setNewChore] = useState({ title: '', description: '', family_id: 0, assigned_to_id: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || !user) {
      router.push('/login');
    } else if (!family) {
      router.push('/families/new');
    } else {
      setNewChore({ ...newChore, family_id: family.id, assigned_to_id: user.id });
      fetchChores();
    }
  }, [token, user, family, router]);

  const fetchChores = async () => {
    try {
      const response = await fetch('http://localhost:8000/chores', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch chores');
      const data = await response.json();
      setChores(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCreateChore = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/chores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newChore),
      });
      if (!response.ok) throw new Error('Failed to create chore');
      const data = await response.json();
      setChores([...chores, data]);
      setNewChore({ title: '', description: '', family_id: family!.id, assigned_to_id: user!.id });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleToggleStatus = async (choreId: number) => {
    const chore = chores.find(c => c.id === choreId);
    if (chore) {
      try {
        const response = await fetch(`http://localhost:8000/chores/${choreId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...chore, status: !chore.status, family_id: family!.id, assigned_to_id: user!.id }),
        });
        if (!response.ok) throw new Error('Failed to update chore');
        const updatedChore = await response.json();
        setChores(chores.map(c => c.id === choreId ? updatedChore : c));
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleDeleteChore = async (choreId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/chores/${choreId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete chore');
      setChores(chores.filter(c => c.id !== choreId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!token || !user) {
    return null;
  }

  if (!family) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center">Welcome to Your FamLink Dashboard</h1>
        <p className="mt-4 text-lg text-gray-600 text-center">Manage your family’s chores, schedules, and events here.</p>

        {error && <div className="mt-4 bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>}

        <form onSubmit={handleCreateChore} className="mt-8 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Chore Title</label>
            <input
              id="title"
              type="text"
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={newChore.title}
              onChange={(e) => setNewChore({ ...newChore, title: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={newChore.description || ''}
              onChange={(e) => setNewChore({ ...newChore, description: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:bg-blue-700 hover:scale-105 transition-transform duration-200"
          >
            Add Chore
          </button>
        </form>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900">Your Chores</h2>
          {chores.length === 0 ? (
            <p className="mt-4 text-gray-600">No chores yet. Add one above!</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {chores.map((chore) => (
                <li key={chore.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{chore.title}</h3>
                    <p className="text-sm text-gray-600">{chore.description || 'No description'}</p>
                    <p className="text-xs text-gray-500">Created: {new Date(chore.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleToggleStatus(chore.id)}
                      className={`px-3 py-1 rounded-full text-white ${chore.status ? 'bg-green-500' : 'bg-blue-500'} hover:opacity-80`}
                    >
                      {chore.status ? 'Completed' : 'Mark Done'}
                    </button>
                    <button
                      onClick={() => handleDeleteChore(chore.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-full hover:opacity-80"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}