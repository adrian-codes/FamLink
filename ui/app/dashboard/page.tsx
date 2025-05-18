'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import '../../styles/calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

interface Chore {
  id: number;
  title: string;
  description: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
  assigned_to_id: number;
}

interface Event {
  id: number;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  created_at: string;
  assignees: { id: number; username: string }[] | null;
}

interface FamilyMember {
  id: number;
  username: string;
}

const localizer = momentLocalizer(moment);

export default function Dashboard() {
  const { token, user, family, logout } = useAuth();
  const router = useRouter();
  const [chores, setChores] = useState<Chore[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [newChore, setNewChore] = useState({ title: '', description: '', family_id: 0, assigned_to_id: 0 });
  const [newEvent, setNewEvent] = useState({ title: '', description: '', family_id: 0, start_time: '', end_time: '', assignee_ids: [] as number[] });
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!token || !user) {
      router.push('/login');
    } else if (!family) {
      router.push('/families/new');
    } else {
      setNewChore({ ...newChore, family_id: family.id, assigned_to_id: user.id });
      setNewEvent({ ...newEvent, family_id: family.id });
      fetchChores();
      fetchEvents();
      fetchFamilyMembers();
      checkAdminStatus();
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

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:8000/events', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data);
    } catch (err: any) {
      setError(err.message);
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
      setFamilyMembers(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const checkAdminStatus = async () => {
    try {
      const response = await fetch(`http://localhost:8000/families/my-family`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch family details');
      const familyData = await response.json();
      setIsAdmin(familyData.admin_id != null && user!.id === familyData.admin_id);
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

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEvent),
      });
      if (!response.ok) throw new Error('Failed to create event');
      const data = await response.json();
      setEvents([...events, data]);
      setNewEvent({ title: '', description: '', family_id: family!.id, start_time: '', end_time: '', assignee_ids: [] });
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

  const handleDeleteEvent = async (eventId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete event');
      setEvents(events.filter(e => e.id !== eventId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getAssignedMemberName = (assignedToId: number) => {
    const member = familyMembers.find(member => member.id === assignedToId);
    return member ? member.username : 'Unknown';
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => parseInt(option.value));
    if (selectedOptions.includes(-1)) {
      setNewEvent({ ...newEvent, assignee_ids: familyMembers.map(member => member.id) });
    } else {
      setNewEvent({ ...newEvent, assignee_ids: selectedOptions });
    }
  };

  const calendarEvents = events.map(event => ({
    id: event.id,
    title: `${event.title} (${event.assignees && event.assignees.length > 0 ? event.assignees.map(a => a.username).join(', ') : 'No assignees'})`,
    start: new Date(event.start_time),
    end: new Date(event.end_time),
  }));

  if (!token || !user) {
    router.push('/login');
    return null;
  }

  if (!family) {
    router.push('/families/new');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">Welcome to Your FamLink Dashboard</h1>
            <p className="mt-4 text-lg text-gray-600">Manage your family’s chores, schedules, and events here.</p>
          </div>
          <div className="space-x-2">
            {isAdmin && (
              <Link href="/families/manage" className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 transition">
                Manage Family
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {error && <div className="mt-4 bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>}

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add a New Chore</h2>
          <form onSubmit={handleCreateChore} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                <label htmlFor="assigned_to_id" className="block text-sm font-medium text-gray-700">Assign To</label>
                <select
                  id="assigned_to_id"
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newChore.assigned_to_id}
                  onChange={(e) => setNewChore({ ...newChore, assigned_to_id: parseInt(e.target.value) })}
                >
                  {familyMembers.map(member => (
                    <option key={member.id} value={member.id}>{member.username}</option>
                  ))}
                </select>
              </div>
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
        </div>

        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add a New Event</h2>
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="event_title" className="block text-sm font-medium text-gray-700">Event Title</label>
                <input
                  id="event_title"
                  type="text"
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="assignees" className="block text-sm font-medium text-gray-700">Assignees</label>
                <select
                  id="assignees"
                  multiple
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newEvent.assignee_ids}
                  onChange={handleAssigneeChange}
                >
                  <option value={-1}>Whole Family</option>
                  {familyMembers.map(member => (
                    <option key={member.id} value={member.id}>{member.username}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                  id="start_time"
                  type="datetime-local"
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newEvent.start_time}
                  onChange={(e) => setNewEvent({ ...newEvent, start_time: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">End Time</label>
                <input
                  id="end_time"
                  type="datetime-local"
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newEvent.end_time}
                  onChange={(e) => setNewEvent({ ...newEvent, end_time: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label htmlFor="event_description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="event_description"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={newEvent.description || ''}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:bg-blue-700 hover:scale-105 transition-transform duration-200"
            >
              Add Event
            </button>
          </form>
        </div>

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
                    <p className="text-xs text-gray-500">Assigned to: {getAssignedMemberName(chore.assigned_to_id)}</p>
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

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900">Family Schedule (List View)</h2>
          {events.length === 0 ? (
            <p className="mt-4 text-gray-600">No events yet. Add one above!</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {events.map((event) => (
                <li key={event.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-600">{event.description || 'No description'}</p>
                    <p className="text-xs text-gray-500">
                      Assignees: {(event.assignees && event.assignees.length > 0) ? event.assignees.map(assignee => assignee.username).join(', ') : 'None'}
                    </p>
                    <p className="text-xs text-gray-500">
                      From: {new Date(event.start_time).toLocaleString()} To: {new Date(event.end_time).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Created: {new Date(event.created_at).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900">Family Schedule (Calendar View)</h2>
          <div className="bg-white p-6 rounded-lg shadow-md mt-4">
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              defaultView="month"
              onSelectEvent={(event) => alert(`Event: ${event.title}`)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}