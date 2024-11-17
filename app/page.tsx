'use client';

import { getElectionTopic, login, vote } from '@/tools/user';
import { useEffect, useState } from 'react';

export default function Home() {
  const [studentID, setStudentID] = useState('');
  const [pin, setPin] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [desiredVote, setDesiredVote] = useState('');
  const [electionTopic, setElectionTopic] = useState('');

  async function loginClient() {
    const loginResult: any = await login(studentID, pin);
    alert(loginResult[1]);
    if (loginResult[0]) {
      setLoggedIn(true);
    }
  }

  async function voteClient() {
    const voteResult: any = await vote(studentID, pin, desiredVote);
    alert(voteResult[1]);
  }

  useEffect(() => {
    setInterval(() => {
      getElectionTopic().then((topic) => {
        setElectionTopic(topic);
      });
    }, 1000);
  }, []);

  return (
    <div className="p-8 font-outfit">
      <div className="flex justify-center items-center gap-2">
        <img src="icon.png" className="w-20" />
        <p className="text-3xl text-brandlight">AlgoSoc Voting Portal</p>
      </div>

      {!loggedIn && (
        <div className="bg-brandlight p-4 mt-4 rounded-lg">
          <p className="text-2xl text-branddark">Student ID</p>
          <input
            type="text"
            className="text-2xl text-brandlight bg-branddark p-2 rounded-lg"
            onChange={(e) => setStudentID(e.target.value)}
          />
          <p className="text-2xl text-branddark mt-4">PIN</p>
          <input
            type="password"
            className="text-2xl text-brandlight bg-branddark p-2 rounded-lg"
            onChange={(e) => setPin(e.target.value)}
          />
          <br />
          <button
            className="text-2xl text-brandlight bg-brandgray py-2 px-4 mt-4 rounded-lg"
            onClick={loginClient}
          >
            Log in
          </button>
        </div>
      )}

      {loggedIn && (
        <div className="bg-brandlight p-4 mt-4 rounded-lg">
          <p className="text-2xl text-branddark">{electionTopic} (Y/N)</p>
          <input
            type="text"
            className="text-2xl text-brandlight bg-branddark p-2 rounded-lg"
            onChange={(e) => setDesiredVote(e.target.value)}
          />
          <br />
          <button
            className="text-2xl text-brandlight bg-brandgray py-2 px-4 mt-4 rounded-lg"
            onClick={voteClient}
          >
            Vote
          </button>
        </div>
      )}
    </div>
  );
}
