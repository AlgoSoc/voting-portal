'use client';

import { Button, Card, CardContent } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/admin/check-admin`,
          {
            withCredentials: true,
          }
        );
        if (response.status !== 200) {
          throw new Error('Not authenticated');
        }
      } catch (error) {
        console.error('Authentication failed:', error);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleViewCandidates = () => {
    router.push('/admin/view-candidates');
  };

  const handleLiveVoting = () => {
    router.push('/admin/live-voting');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center">
        <p className="text-white text-2xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black font-outfit flex flex-col items-center justify-start p-6">
      <div className="flex items-center gap-4 mb-10">
        <img src="/icon.png" className="w-24" alt="AlgoSoc Icon" />
        <h1 className="text-3xl font-bold text-white">
          AlgoSoc Admin Dashboard
        </h1>
      </div>
      <Card className="w-full max-w-4xl bg-[#FFFBF0] shadow-lg rounded-xl">
        <CardContent className="p-8 space-y-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Welcome, Admin
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Button
              className="h-32 bg-yellow-400 text-black text-xl font-semibold rounded-lg shadow-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-600 transition duration-200 ease-in-out"
              onClick={handleViewCandidates}
            >
              View Candidates
            </Button>
            <Button
              className="h-32 bg-[#4A4A4A] text-white text-xl font-semibold rounded-lg shadow-md hover:bg-[#333333] focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200 ease-in-out"
              onClick={handleLiveVoting}
            >
              View Live Voting
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
