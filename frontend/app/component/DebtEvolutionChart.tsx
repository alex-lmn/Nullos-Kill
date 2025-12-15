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

interface DebtEvolutionChartProps {
  data: any[];
  players: Player[];
  colors: string[];
}

export function DebtEvolutionChart({ data, players, colors }: DebtEvolutionChartProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg mt-8">
      <h2 className="text-xl font-bold text-white mb-4">
        Évolution de la dette
      </h2>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" unit="€" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#333",
                border: "none",
                color: "#fff",
              }}
              formatter={(value: number) => [
                `${value.toFixed(2)} €`,
                "Dette",
              ]}
            />
            <Legend />
            {players.map((player, index) => (
              <Line
                key={player.id}
                type="monotone"
                dataKey={player.name}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
