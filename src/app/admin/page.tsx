'use client'

import { getVoteTable, setElectionTopic } from "@/tools/user";
import { useEffect, useState } from "react";

export default function Home() {
  const [adminPin, setAdminPin] = useState("");
  const [desiredET, setDesiredET] = useState("");

  async function setElectionTopicClient() {
    await setElectionTopic(adminPin, desiredET);
  }

  let lastInterval: NodeJS.Timeout;
  useEffect(() => {
    clearInterval(lastInterval);
    lastInterval = setInterval(async () => {
      console.table(await getVoteTable(adminPin));
    }, 5000);
  }, [adminPin])

  return (
    <div className="p-8 font-outfit">

      <div className="flex justify-center items-center gap-2">
        <img src="icon.png" className="w-20" />
        <p className="text-3xl text-brandlight">AlgoSoc Voting Portal</p>
        <p className="text-2xl text-brandlight">Admin Panel</p>
      </div>

      <div className="bg-brandlight p-4 mt-4 rounded-lg">
        <p className="text-2xl text-branddark mt-4">Admin PIN</p>
        <input
          type="password"
          className="text-2xl text-brandlight bg-branddark p-2 rounded-lg"
          onChange={(e) => setAdminPin(e.target.value)} />
        <br />
      </div>

      <div className="bg-brandlight p-4 mt-4 rounded-lg">
        <p className="text-2xl text-branddark">Set election topic</p>
        <input
          type="text"
          className="text-2xl text-brandlight bg-branddark p-2 rounded-lg"
          onChange={(e) => setDesiredET(e.target.value)} />
        <br />
        <button
          className="text-2xl text-brandlight bg-brandgray py-2 px-4 mt-4 rounded-lg"
          onClick={setElectionTopicClient}>Set election topic</button>
      </div>
      
    </div>
  );
}
