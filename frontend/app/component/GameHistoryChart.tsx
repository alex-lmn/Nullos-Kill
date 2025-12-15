import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Player } from "../types";

interface GameHistoryChartProps {
  data: any[];
  players: Player[];
  colors: string[];
}

export function GameHistoryChart({ data, players, colors }: GameHistoryChartProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-8 mt-12">
      <h2 className="text-xl font-bold text-white mb-4">
        Historique des parties
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="name" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip
            contentStyle={{ backgroundColor: "#333", borderRadius: "8px" }}
            labelStyle={{ color: "#fff", fontWeight: "bold" }}
            itemStyle={{ color: "#fff" }}
          />
          <Legend
            wrapperStyle={{ paddingTop: "10px", paddingLeft: "10px" }}
            iconType="circle"
            iconSize={10}
            formatter={(value) => (
              <span className="text-sm text-white">{value}</span>
            )}
          />
          <CartesianGrid strokeDasharray="3 3" stroke="#555" />
          {players.map((player, index) => (
            <Line
              key={player.id}
              type="monotone"
              dataKey={player.name}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
