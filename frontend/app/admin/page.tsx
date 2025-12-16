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

export default function AdminPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [multiplier, setMultiplier] = useState(10);
  const [lastGameMessage, setLastGameMessage] = useState<string | null>(null);
  const [tieCandidates, setTieCandidates] = useState<Player[] | null>(null);
  const [pendingDebt, setPendingDebt] = useState<number>(0);
  const [tieType, setTieType] = useState<"loser" | "winner" | null>(null);
  const [pendingLoserId, setPendingLoserId] = useState<number | null>(null);
  const [history, setHistory] = useState<GameHistory[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [areScoresVisible, setAreScoresVisible] = useState(true);
  const [isMultiplierVisible, setIsMultiplierVisible] = useState(true);
  const [isLoserPreviewVisible, setIsLoserPreviewVisible] = useState(false);
  const [areRevivesVisible, setAreRevivesVisible] = useState(true);

  const fetchHistory = () => {
    fetch("http://localhost:3001/players/history")
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch((err) => console.error("Failed to fetch history:", err));
  };

  useEffect(() => {
    fetch("http://localhost:3001/players")
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch((err) => console.error("Failed to fetch players:", err));

    fetch("http://localhost:3001/players/settings")
      .then((res) => res.json())
      .then((data) => {
        setMultiplier(data.multiplier);
        setIsVisible(data.isVisible);
        setAreScoresVisible(data.areScoresVisible);
        setIsMultiplierVisible(data.isMultiplierVisible);
        setIsLoserPreviewVisible(data.isLoserPreviewVisible);
        setAreRevivesVisible(data.areRevivesVisible);
      })
      .catch((err) => console.error("Failed to fetch settings:", err));

    fetchHistory();

    socket.on("scoreUpdate", (updatedPlayers: Player[]) => {
      setPlayers(updatedPlayers);
      fetchHistory();
    });

    socket.on("settingsUpdate", (settings: any) => {
      setMultiplier(settings.multiplier);
      setIsVisible(settings.isVisible);
      setAreScoresVisible(settings.areScoresVisible);
      setIsMultiplierVisible(settings.isMultiplierVisible);
      setIsLoserPreviewVisible(settings.isLoserPreviewVisible);
      setAreRevivesVisible(settings.areRevivesVisible);
    });

    return () => {
      socket.off("scoreUpdate");
      socket.off("settingsUpdate");
    };
  }, []);

  const updateVisibility = async (visible: boolean) => {
    setIsVisible(visible);
    await fetch("http://localhost:3001/players/settings/visibility", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isVisible: visible }),
    });
  };

  const updateScoresVisibility = async (visible: boolean) => {
    setAreScoresVisible(visible);
    await fetch("http://localhost:3001/players/settings/scores-visibility", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ areScoresVisible: visible }),
    });
  };

  const updateMultiplierVisibility = async (visible: boolean) => {
    setIsMultiplierVisible(visible);
    await fetch("http://localhost:3001/players/settings/multiplier-visibility", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isMultiplierVisible: visible }),
    });
  };

  const updateLoserPreviewVisibility = async (visible: boolean) => {
    setIsLoserPreviewVisible(visible);
    await fetch("http://localhost:3001/players/settings/loser-preview-visibility", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isLoserPreviewVisible: visible }),
    });
  };

  const updateRevivesVisibility = async (visible: boolean) => {
    setAreRevivesVisible(visible);
    await fetch("http://localhost:3001/players/settings/revives-visibility", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ areRevivesVisible: visible }),
    });
  };

  const updatePlayerMultiplier = async (id: number, multiplier: number) => {
    await fetch(`http://localhost:3001/players/${id}/multiplier`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ multiplier }),
    });
  };

  const addPlayer = async () => {
    if (!newPlayerName) return;
    await fetch("http://localhost:3001/players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newPlayerName }),
    });
    setNewPlayerName("");
  };

  const updatePlayer = async (id: number, data: Partial<Player>) => {
    setPlayers(players.map((p) => (p.id === id ? { ...p, ...data } : p)));
    await fetch(`http://localhost:3001/players/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  const deletePlayer = async (id: number) => {
    await fetch(`http://localhost:3001/players/${id}`, {
      method: "DELETE",
    });
  };

  const updateMultiplier = async (value: number) => {
    setMultiplier(value);
    await fetch("http://localhost:3001/players/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ multiplier: value }),
    });
  };

  const finishGame = async (forceLoserId?: number, forceWinnerId?: number) => {
    if (
      !forceLoserId &&
      !forceWinnerId &&
      !confirm(
      "Êtes-vous sûr de vouloir terminer la partie ? Cela calculera les dettes et réinitialisera les scores."
      )
    ) {
      return;
    }

    try {
      const body = JSON.stringify({ forceLoserId, forceWinnerId });
      const res = await fetch("http://localhost:3001/players/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      const data = await res.json();
      console.log("Finish Game Response:", data);

      if (data.status === "tie_loser") {
        setTieCandidates(data.candidates);
        setPendingDebt(data.debtAmount);
        setTieType("loser");
        setLastGameMessage(null);
      } else if (data.status === "tie_winner") {
        setTieCandidates(data.candidates);
        setPendingDebt(data.debtAmount);
        setTieType("winner");
        setPendingLoserId(data.pendingLoserId);
        setLastGameMessage(null);
      } else if (data.status === "resolved" && data.result) {
        const { losers, winners, debt } = data.result;
        const formattedDebt = formatCurrency(debt);
        setLastGameMessage(
          `Le joueur ${losers.join(
            ", "
          )} a perdu, il doit payer la somme de ${formattedDebt} pour cette partie à ${winners.join(
            ", "
          )}.`
        );
        setTieCandidates(null);
        setPendingDebt(0);
        setTieType(null);
        setPendingLoserId(null);
      } else {
        console.warn("Unexpected response", data);
      }
    } catch (error) {
      console.error("Error finishing game:", error);
    }
  };

  const resolveTie = (playerId: number) => {
    const action = tieType === "loser" ? "perdant" : "gagnant";
    if (confirm(`Désigner ce joueur comme ${action} ?`)) {
      if (tieType === "loser") {
        finishGame(playerId);
      } else if (tieType === "winner" && pendingLoserId) {
        finishGame(pendingLoserId, playerId);
      }
    }
  };

  const resetAll = async () => {
    if (
      confirm(
        "ATTENTION : ceci réinitialisera TOUS les scores et toutes les dettes à zéro. Continuer ?"
      )
    ) {
      await fetch("http://localhost:3001/players/reset", { method: "POST" });
      setLastGameMessage(null);
    }
  };

  const formatCurrency = (cents: number) => {
    return (cents / 100).toLocaleString("fr-FR", {
      style: "currency",
      currency: "EUR",
    });
  };

  const currentSum = players.reduce((acc, p) => {
    // In Valorant Mode (!areRevivesVisible), only kills count for money.
    // In Standard Mode, both kills and revives count.
    const points = areRevivesVisible 
      ? (p.kills + p.revives) 
      : p.kills;
    return acc + points * (p.scoreMultiplier || 1);
  }, 0) * multiplier;

  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#0088fe",
    "#00c49f",
    "#ffbb28",
    "#ff8042",
  ];

  const chartData = Array.isArray(history)
    ? history.map((h, index) => {
        const dataPoint: any = { name: `Game ${index + 1}` };
        Object.entries(h.debtsSnapshot).forEach(([playerName, debt]) => {
          dataPoint[playerName] = debt / 100;
        });
        return dataPoint;
      })
    : [];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <LastGameResult
        message={lastGameMessage}
        onClose={() => setLastGameMessage(null)}
      />
      
      <TieResolutionModal
        tieType={tieType}
        tieCandidates={tieCandidates}
        pendingDebt={pendingDebt}
        formatCurrency={formatCurrency}
        onResolve={resolveTie}
        onCancel={() => {
          setTieCandidates(null);
          setTieType(null);
          setPendingLoserId(null);
        }}
      />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Panel - Players</h1>
        <div className="flex gap-4">
          <IconButton
            onClick={() => finishGame()}
            icon="sports_score"
            className="bg-yellow-600 text-white px-4 py-2 rounded-xl hover:bg-yellow-700"
          >
            Game terminer
          </IconButton>
          <button
            onClick={resetAll}
            className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700"
          >
            FULL RESET
          </button>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg mb-8 flex items-center gap-4 flex-wrap">
        <h1 className="text-2xl text-white font-bold w-full">Paramètres de Stream</h1>
        <div className="flex items-center gap-4">
          <label className="text-white font-bold">
            Multiplicateur (en centimes par point) :
          </label>
          <input
            type="number"
            value={multiplier}
            onChange={(e) => updateMultiplier(Number(e.target.value))}
            className="border p-2 rounded-xl text-white w-24 bg-gray-700 border-gray-600"
          />
        </div>

        <div className="flex items-center gap-4 bg-gray-700 px-4 py-2 rounded-xl border border-gray-600">
          <label className="text-white font-bold">
            Somme en jeu :
          </label>
          <span className="text-2xl font-mono text-green-400 font-bold">
            {formatCurrency(currentSum)}
          </span>
        </div>
        
        <IconButton
          onClick={() => updateVisibility(!isVisible)}
          icon={isVisible ? "visibility" : "visibility_off"}
          className={`px-4 py-2 rounded-xl font-bold ${
            isVisible 
              ? "bg-green-600 hover:bg-green-700 text-white" 
              : "bg-gray-600 hover:bg-gray-700 text-gray-300"
          }`}
        >
          {isVisible ? "Stream Visible" : "Stream Hidden"}
        </IconButton>

        <IconButton
          onClick={() => updateScoresVisibility(!areScoresVisible)}
          icon={areScoresVisible ? "group" : "group_off"}
          className={`px-4 py-2 rounded-xl font-bold ${
            areScoresVisible 
              ? "bg-blue-600 hover:bg-blue-700 text-white" 
              : "bg-gray-600 hover:bg-gray-700 text-gray-300"
          }`}
        >
          {areScoresVisible ? "Scores Visible" : "Scores Hidden"}
        </IconButton>

        <IconButton
          onClick={() => updateMultiplierVisibility(!isMultiplierVisible)}
          icon={isMultiplierVisible ? "attach_money" : "money_off"}
          className={`px-4 py-2 rounded-xl font-bold ${
            isMultiplierVisible 
              ? "bg-yellow-600 hover:bg-yellow-700 text-white" 
              : "bg-gray-600 hover:bg-gray-700 text-gray-300"
          }`}
        >
          {isMultiplierVisible ? "Multiplier Visible" : "Multiplier Hidden"}
        </IconButton>

        <IconButton
          onClick={() => updateLoserPreviewVisibility(!isLoserPreviewVisible)}
          icon={isLoserPreviewVisible ? "person_off" : "person"}
          className={`px-4 py-2 rounded-xl font-bold ${
            isLoserPreviewVisible 
              ? "bg-red-600 hover:bg-red-700 text-white" 
              : "bg-gray-600 hover:bg-gray-700 text-gray-300"
          }`}
        >
          {isLoserPreviewVisible ? "Hide Loser" : "Show Loser"}
        </IconButton>

        <IconButton
          onClick={() => updateRevivesVisibility(!areRevivesVisible)}
          icon={areRevivesVisible ? "medical_services" : "skull"}
          className={`px-4 py-2 rounded-xl font-bold ${
            areRevivesVisible 
              ? "bg-teal-600 hover:bg-teal-700 text-white" 
              : "bg-red-900 hover:bg-red-800 text-white"
          }`}
        >
          {areRevivesVisible ? "Mode Standard" : "Mode Valorant"}
        </IconButton>
      </div>

      <div className="mb-8 flex gap-4">
        <input
          type="text"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          className="border p-2 rounded-xl text-white flex-1"
          placeholder="New Player Name"
        />
        <button
          onClick={addPlayer}
          className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
        >
          Add Player
        </button>
      </div>

      <div className="flex flex-wrap gap-6">
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            otherPlayers={players.filter((p) => p.id !== player.id)}
            onUpdate={updatePlayer}
            onUpdateMultiplier={updatePlayerMultiplier}
            onDelete={deletePlayer}
            formatCurrency={formatCurrency}
            areRevivesVisible={areRevivesVisible}
          />
        ))}
      </div>
      <IconButton
        onClick={() => finishGame()}
        icon="sports_score"
        className="bg-yellow-600 text-white px-4 py-2 rounded-xl hover:bg-yellow-700 w-full mt-12"
      >
        Game terminer
      </IconButton>
      
      <GameHistoryChart data={chartData} players={players} colors={COLORS} />
      <DebtEvolutionChart data={chartData} players={players} colors={COLORS} />
    </div>
  );
}
