"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";


export default function Home() {
  const [selectedGame, setSelectedGame] = useState("tk8");
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Trigger API call whenever selectedGame changes
  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/character/${selectedGame}`);
        console.log(`${process.env.NEXT_PUBLIC_API_URL}/character/${selectedGame}`);
        console.log(`${process.env}}`);
        setCharacters(res.data);
      } catch (error) {
        console.error("Error fetching characters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [selectedGame]); // Trigger the effect when `selectedGame` changes

  const handleGameChange = (e) => {
    setSelectedGame(e.target.value); // Update the selected game value
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <label htmlFor="gameSelector" className="mr-2">Select Game:</label>
        <select
          id="gameSelector"
          value={selectedGame}
          onChange={handleGameChange}
          className="p-2 border rounded bg-white text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 hover:-translate-y-1 hover:shadow-lg"
        >
          <option value="tk8">TK8</option>
          <option value="tk7">TK7</option>
        </select>
      </div>

      {loading ? (
        <p>Loading characters...</p>
      ) : characters.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
  {characters.map((character) => (
    <div
      key={character.characterGameId}
      className="p-4 rounded-xl shadow-md bg-transparent dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-transform hover:-translate-y-1"
    >
      <img
        src={`${character.pictureUrl}`}
        alt={character.name}
        className="w-32 h-32 object-cover rounded-full mb-2 transition-transform hover:scale-105"
      />
      <h2 className="text-lg font-semibold mb-2">{character.name}</h2>
      <Link
        href={`/${selectedGame}/${character.name.toLowerCase()}`}
        className="text-blue-500 hover:underline"
      >
        View Moves
      </Link>
    </div>
  ))}
</div>

      ):(<h1 className="text-2xl font-bold mb-4 capitalize">
        We had a problem loading the data
        </h1>)}
    </div>
  );
}
