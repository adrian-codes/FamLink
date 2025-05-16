'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

interface FamilyMember {
  id: number;
  username: string;
}

export default function ManageFamily() {
  const { token, user, family } = useAuth();
  const router = useRouter();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [newMember, setNewMember] = useState({ username: '', email: '', temporary_password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token || !user) {
      router.push('/login');
    } else if (!family) {
      router.push('/families/new');
    } else {
      fetchFamilyDetails();
      fetchFamilyMembers();
    }
  }, [token, user, family, router]);

  useEffect(() => {
    if (isAdmin === false) {
      router.push('/dashboard');
    }
  }, [isAdmin, router]);

  const fetchFamilyDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8000/families/my-family`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch family details');
      const familyData = await response.json();
      console.log('Family Data:', familyData);
      console.log('Family admin_id:', familyData.admin_id);

      const responseUser = await fetch('http://localhost:8000/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!responseUser.ok) throw new Error('Failed to fetch user details');
      const userData = await responseUser.json();
      console.log('User Data:', userData);

      const isAdminResult = familyData.admin_id != null && userData.id === familyData.admin_id;
      setIsAdmin(isAdminResult);
      console.log('Is Admin:', isAdminResult);
    } catch (err: any) {
      setError(err.message);
      console.error('Error in fetchFamilyDetails:', err);
      setIsAdmin(false);
    }
  };

  const fetchFamilyMembers = async () => {
    try {
      const response = await fetch(`http://localhost:8000/families/${family?.id}/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch family members');
      const data = await response.json();
      setMembers(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`http://localhost:8000/families/${family?.id}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newMember),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add family member');
      }

      const newMemberResponse = await response.json();
      setMembers([...members, newMemberResponse]);
      setSuccess('Family member added successfully! They can log in with the temporary password.');
      setNewMember({ username: '', email: '', temporary_password: '' });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemoveMember = async (userId: number) => {
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`http://localhost:8000/families/${family?.id}/members/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to remove family member');
      }

      setMembers(members.filter(member => member.id !== userId));
      setSuccess('Family member removed successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!token || !user || !family || isAdmin === null) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center">Manage Your Family</h1>
        <p className="mt-4 text-lg text-gray-600 text-center">
          Add or remove members from your family ({family.name}).
        </p>

        {error && <div className="mt-4 bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>}
        {success && <div className="mt-4 bg-green-50 text-green-700 p-4 rounded-lg">{success}</div>}

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add a Family Member</h2>
          <form onSubmit={handleAddMember} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <input
                id="username"
                type="text"
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={newMember.username}
                onChange={(e) => setNewMember({ ...newMember, username: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="temporary_password" className="block text-sm font-medium text-gray-700">Temporary Password</label>
              <input
                id="temporary_password"
                type="password"
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={newMember.temporary_password}
                onChange={(e) => setNewMember({ ...newMember, temporary_password: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:bg-blue-700 hover:scale-105 transition-transform duration-200"
            >
              Add Member
            </button>
          </form>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900">Family Members</h2>
          {members.length === 0 ? (
            <p className="mt-4 text-gray-600">No members yet. Add one above!</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {members.map((member) => (
                <li key={member.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{member.username}</h3>
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}