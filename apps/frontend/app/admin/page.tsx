'use client';

import { Button, Card, CardContent, Input } from '@repo/ui';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Component() {
  const [studentId, setStudentId] = useState('');
  const [pin, setPin] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const payload = {
        studentId,
        pin,
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/admin/login`,
        payload,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        router.push('/admin/adminDashboard');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black font-outfit flex flex-col items-center justify-center p-6">
      <div className="flex items-center gap-4 mb-10">
        <img src="icon.png" className="w-24" alt="AlgoSoc Icon" />
        <h1 className="text-3xl font-bold text-white">
          AlgoSoc Voting Portal (Admin)
        </h1>
      </div>
      <Card className="w-full max-w-md bg-[#FFFBF0] shadow-lg rounded-xl">
        <CardContent className="p-8 space-y-8">
          <div className="space-y-4">
            <label
              htmlFor="student-id"
              className="block text-lg font-semibold text-gray-700"
            >
              Student ID
            </label>
            <Input
              id="student-id"
              className="h-12 bg-yellow-100 text-black border-2 border-yellow-400 focus:ring-2 focus:ring-yellow-400 rounded-lg"
              type="text"
              onChange={(e) => setStudentId(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            <label
              htmlFor="pin"
              className="block text-lg font-semibold text-gray-700"
            >
              PIN
            </label>
            <Input
              id="pin"
              className="h-12 bg-yellow-100 text-black border-2 border-yellow-400 focus:ring-2 focus:ring-yellow-400 rounded-lg"
              type="password"
              onChange={(e) => setPin(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      <Button
        className="w-32 h-12 mt-6 bg-[#4A4A4A] text-white rounded-lg shadow-md hover:bg-[#333333] focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200 ease-in-out"
        onClick={handleLogin}
      >
        Log in
      </Button>
    </div>
  );
}
