'use client';

import { useState, useEffect } from 'react';
import { Button, Card, CardContent, Input } from '@repo/ui';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface User {
  studentId: string;
  firstName: string;
  lastName: string;
}

interface Candidate {
  id: string;
  user: User;
  position: {
    name: string;
  };
}

interface Position {
  id: string;
  name: string;
}

export default function ManageCandidatesAndPositions() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [newCandidate, setNewCandidate] = useState({
    studentId: '',
    positionId: '',
  });
  const [newPosition, setNewPosition] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCandidates();
    fetchPositions();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/admin/candidates`,
        { withCredentials: true }
      );
      setCandidates(response.data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setError('Failed to fetch candidates');
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/admin/positions`,
        { withCredentials: true }
      );
      setPositions(response.data);
    } catch (error) {
      console.error('Error fetching positions:', error);
      setError('Failed to fetch positions');
    }
  };

  const handleAddCandidate = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/admin/candidates`,
        newCandidate,
        { withCredentials: true }
      );
      setNewCandidate({ studentId: '', positionId: '' });
      fetchCandidates();
    } catch (error) {
      console.error('Error adding candidate:', error);
      setError('Failed to add candidate');
    }
  };

  const handleDeleteCandidate = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/v1/admin/candidates/${id}`, {
        withCredentials: true,
      });
      fetchCandidates();
    } catch (error) {
      console.error('Error deleting candidate:', error);
      setError('Failed to delete candidate');
    }
  };

  const handleAddPosition = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/admin/positions`,
        { name: newPosition },
        { withCredentials: true }
      );
      setNewPosition('');
      fetchPositions();
    } catch (error) {
      console.error('Error adding position:', error);
      setError('Failed to add position');
    }
  };

  return (
    <div className="min-h-screen w-full bg-black font-outfit flex flex-col items-center justify-start p-6">
      <div className="flex items-center gap-4 mb-10">
        <img src="/icon.png" className="w-24" alt="AlgoSoc Icon" />
        <h1 className="text-3xl font-bold text-white">AlgoSoc Management</h1>
      </div>
      {error && (
        <div className="w-full max-w-4xl bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          {error}
        </div>
      )}
      <Card className="w-full max-w-4xl bg-[#FFFBF0] shadow-lg rounded-xl mb-8">
        <CardContent className="p-8 space-y-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Manage Positions
          </h2>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">
              Add New Position
            </h3>
            <div className="flex space-x-4">
              <Input
                placeholder="Position Name"
                value={newPosition}
                onChange={(e) => setNewPosition(e.target.value)}
                className="flex-grow bg-yellow-100 border-2 border-yellow-400 focus:ring-2 focus:ring-yellow-400 rounded-lg"
              />
              <Button
                onClick={handleAddPosition}
                className="bg-yellow-400 text-black font-semibold rounded-lg shadow-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-600 transition duration-200 ease-in-out"
              >
                Add Position
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">
              Current Positions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {positions.map((position) => (
                <div
                  key={position.id}
                  className="bg-white p-4 rounded-lg shadow"
                >
                  {position.name}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full max-w-4xl bg-[#FFFBF0] shadow-lg rounded-xl">
        <CardContent className="p-8 space-y-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Manage Candidates
          </h2>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">
              Add New Candidate
            </h3>
            <Input
              placeholder="Student ID"
              value={newCandidate.studentId}
              onChange={(e) =>
                setNewCandidate({ ...newCandidate, studentId: e.target.value })
              }
              className="bg-yellow-100 border-2 border-yellow-400 focus:ring-2 focus:ring-yellow-400 rounded-lg"
            />
            <select
              value={newCandidate.positionId}
              onChange={(e) =>
                setNewCandidate({ ...newCandidate, positionId: e.target.value })
              }
              className="w-full p-2 bg-yellow-100 border-2 border-yellow-400 focus:ring-2 focus:ring-yellow-400 rounded-lg"
            >
              <option value="">Select Position</option>
              {positions.map((position) => (
                <option key={position.id} value={position.id}>
                  {position.name}
                </option>
              ))}
            </select>
            <Button
              onClick={handleAddCandidate}
              className="w-full bg-yellow-400 text-black font-semibold rounded-lg shadow-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-600 transition duration-200 ease-in-out"
            >
              Add Candidate
            </Button>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">
              Current Candidates
            </h3>
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="flex justify-between items-center bg-white p-4 rounded-lg shadow"
              >
                <div className="space-y-1">
                  <div className="font-medium">
                    {candidate.user.firstName} {candidate.user.lastName}
                  </div>
                  <div className="text-sm text-gray-600">
                    Student ID: {candidate.user.studentId}
                  </div>
                  <div className="text-sm text-gray-600">
                    Position: {candidate.position.name}
                  </div>
                </div>
                <Button
                  onClick={() => handleDeleteCandidate(candidate.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 ease-in-out"
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
