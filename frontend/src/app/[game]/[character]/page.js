"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function CharacterMovesPage() {
const { game, character } = useParams();
const [moves, setMoves] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
if (!game || !character) return;


const fetchMoves = async () => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/character/${game}/${character}`);
    setMoves(res.data);
  } catch (error) {
    console.error("Error fetching moves:", error);
  } finally {
    setLoading(false);
  }
};

fetchMoves();


}, [game, character]);

return ( <div className="container mx-auto p-4">


  {moves.length ? (
    <h1 className="text-2xl font-bold mb-4 capitalize">
    Moves for {character} ({game})
    </h1>
  ) : (
    <h1 className="text-2xl font-bold mb-4 capitalize">
    Character or game not found
    </h1>
  )}
  
  {loading ? (
    <p>Loading...</p>
  ) : moves.length ? (
    <div className="space-y-4">
      {moves.map((move) => (
        <div key={move.moveId} className="p-4 rounded-xl shadow-md bg-transparent dark:bg-gray-800  border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-transform hover:-translate-y-1">
          <p><strong>Command:</strong> {move.command}</p>
          <p><strong>Damage:</strong> {move.damage}</p>
          <p><strong>Notes:</strong> {move.notes}</p>
        </div>
      ))}
    </div>
  ) : (
    <p></p>
  )}
</div>


);
}
