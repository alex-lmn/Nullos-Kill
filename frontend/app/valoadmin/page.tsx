"use client";

import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { IconButton } from "../component/IconButton";
import { PlayerCard } from "../component/PlayerCard";
import { LastGameResult } from "../component/LastGameResult";
import { TieResolutionModal } from "../component/TieResolutionModal";
import { GameHistoryChart } from "../component/GameHistoryChart";
import { DebtEvolutionChart } from "../component/DebtEvolutionChart";
import { Player, GameHistory } from "../types";

const socket = io("http://localhost:3001");

export default function ValoAdminPage() {
  const [name, setName] = useState("vigames");
  const [tag, setTag] = useState("5926");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/valotrack?name=${encodeURIComponent(name)}&tag=${encodeURIComponent(tag)}`);
      const json = await res.json();
      console.log("API Response:", json);
      if (!res.ok) {
        throw new Error(json.details || json.error || "Failed to fetch");
      }
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">ValoTrack Dashboard</h1>
      
      <div className="bg-gray-100 dark:bg-gray-800 shadow-xl rounded-xl p-6 mb-6 text-gray-800 dark:text-gray-100"> 
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">
                    Riot Name
                </label>
                <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-black dark:text-white min-w-[200px]" 
                    placeholder="Name"
                />
            </div>
            <div className="flex flex-col gap-1">
                 <label className="text-sm font-medium">
                    Tag
                </label>
                <input 
                    type="text" 
                    value={tag} 
                    onChange={(e) => setTag(e.target.value)} 
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-black dark:text-white w-24" 
                    placeholder="Tag"
                />
            </div>
            <button 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                onClick={fetchData} 
                disabled={loading}
            >
                {loading ? "Loading..." : "Get Data"}
            </button>
          </div>
          
          {error && (
              <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800">
                  <span>{error}</span>
              </div>
          )}
      </div>

      {data && (
        <div className="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-auto border border-gray-700 shadow-inner">
            <pre className="text-xs sm:text-sm font-mono text-green-400">
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
      )}
    </div>
  );
}
