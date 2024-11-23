'use client';

import { useState, useEffect } from 'react';
import { Button, Card, CardContent, Input } from '@repo/ui';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  positionId: string;
}

export default function ViewCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [newCandidate, setNewCandidate] = useState({
    firstName: '',
    lastName: '',
    positionId: '',
  });
  const [positions, setPositions] = useState<{ id: string; name: string }[]>(
    []
  );

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
    }
  };

  const handleAddCandidate = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/admin/candidates`,
        newCandidate,
        { withCredentials: true }
      );
      setNewCandidate({ firstName: '', lastName: '', positionId: '' });
      fetchCandidates();
    } catch (error) {
      console.error('Error adding candidate:', error);
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
    }
  };

  return (
    <div className="min-h-screen w-full bg-black font-outfit flex flex-col items-center justify-start p-6">
      <div className="flex items-center gap-4 mb-10">
        <img src="/icon.png" className="w-24" alt="AlgoSoc Icon" />
        <h1 className="text-3xl font-bold text-white">AlgoSoc Candidates</h1>
      </div>
      <Card className="w-full max-w-4xl bg-[#FFFBF0] shadow-lg rounded-xl">
        <CardContent className="p-8 space-y-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Manage Candidates
          </h2>

          {/* Add New Candidate Form */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">
              Add New Candidate
            </h3>
            <Input
              placeholder="First Name"
              value={newCandidate.firstName}
              onChange={(e) =>
                setNewCandidate({ ...newCandidate, firstName: e.target.value })
              }
              className="bg-yellow-100 border-2 border-yellow-400 focus:ring-2 focus:ring-yellow-400 rounded-lg"
            />
            <Input
              placeholder="Last Name"
              value={newCandidate.lastName}
              onChange={(e) =>
                setNewCandidate({ ...newCandidate, lastName: e.target.value })
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

          {/* List of Candidates */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">
              Current Candidates
            </h3>
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="flex justify-between items-center bg-white p-4 rounded-lg shadow"
              >
                <span>{`${candidate.firstName} ${candidate.lastName}`}</span>
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
