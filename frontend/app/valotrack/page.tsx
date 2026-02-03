"use client";

import { useState, useEffect } from "react";
import {
  ValoTrackOverlay,
  ValoTrackOverlayProps,
} from "../component/ValoTrackOverlay";
import { TwitchSoundManager } from "../component/TwitchSoundManager";

export default function ValoTrackPage() {
  const [name, setName] = useState("alex_lmn");
  const [tag, setTag] = useState("EUW");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Dummy data for initial display / fallback
  const [data, setData] = useState<ValoTrackOverlayProps>({
    rank: "SILVER 3",
    rr: 30,
    rankIconUrl:
      "https://trackercdn.com/cdn/tracker.gg/valorant/icons/tiers/11.png", // Example URL
    winPercent: 49,
    kda: 1.02,
    history: [
      { result: "win" },
      { result: "loss" },
      { result: "loss" },
      { result: "loss" },
      { result: "draw" },
      { result: "win" },
      { result: "win" },
    ],
  });

  const fetchData = async () => {
    if (!name || !tag) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/valotrack?name=${encodeURIComponent(
          name
        )}&tag=${encodeURIComponent(tag)}`
      );
      const json = await res.json();
      if (json.error) {
        throw new Error(json.error);
      }

      // TODO: Parse the JSON into 'data' state.
      // Since I assume we want valid real data, I'll log it for now as I can't guarantee structure without seeing it.
      console.log("Tracker Data:", json);

      // MOCK PARSING LOGIC (to be adjusted based on real API response)
      // Assuming tracker.gg structure:
      // const overview = json.data.segments.find(s => s.type === "overview");
      // const rank = overview.stats.rank.metadata.tierName;
      // const icon = overview.stats.rank.metadata.iconUrl;
      // ... etc
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 gap-8">

    //   {/* Controls for Testing */}
    //   <div className="bg-gray-800 p-6 rounded-lg flex flex-col gap-4 w-full max-w-md">
    //     <h2 className="text-white text-xl font-bold mb-2">Overlay Settings</h2>
    //     <div className="flex gap-2">
    //         <input
    //             className="bg-gray-700 text-white rounded px-3 py-2 w-full outline-none focus:ring-2 focus:ring-[#00f0bd]"
    //             placeholder="Name"
    //             value={name}
    //             onChange={(e) => setName(e.target.value)}
    //         />
    //         <input
    //             className="bg-gray-700 text-white rounded px-3 py-2 w-24 outline-none focus:ring-2 focus:ring-[#00f0bd]"
    //             placeholder="Tag"
    //             value={tag}
    //             onChange={(e) => setTag(e.target.value)}
    //         />
    //     </div>
    //     <button
    //         onClick={fetchData}
    //         disabled={loading}
    //         className="bg-[#ff4655] hover:bg-[#ff2b3a] text-white font-bold py-2 rounded transition-colors disabled:opacity-50"
    //     >
    //         {loading ? "Loading..." : "Update Preview"}
    //     </button>
    //     {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
    //   </div>

    //   {/* The Overlay Component */}
    //   <div className="p-10 border border-gray-800 rounded-3xl bg-gray-900/50 relative">
    //       <div className="absolute top-0 left-0 bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded-br-lg">
    //           Stream Overlay Preview
    //       </div>
    <div className="absolute bottom-0 left-0">
      <ValoTrackOverlay {...data} />
    </div>
    //   </div>

    // </div>
  );
}
