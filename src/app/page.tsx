"use client";

import { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { createRedPack } from "@/lib/solana";
import { getSolana } from "@/helpers/getSolana";

export default function CreateRedPack() {
  const [winnersCount, setWinnersCount] = useState<number | "">(1);
  const [totalAmount, setTotalAmount] = useState<number | "">(0.1);
  const [authorNickname, setAuthorNickname] = useState<string>("");

  const handleSubmit = async () => {
    if (!winnersCount || !totalAmount || !authorNickname) {
      alert("Please fill all fields correctly.");
      return;
    }

    try {
      const solana = await getSolana();
      const payer = new PublicKey(solana.publicKey);
      const signature = await createRedPack(
        winnersCount,
        totalAmount,
        authorNickname,
        payer,
      );
      alert(`Red Pack Created! Transaction Signature: ${signature}`);
    } catch (error) {
      console.error("Error creating Red Pack:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Create a Red Pack</h1>
      <form className="space-y-4">
        <div>
          <label>Winners Count</label>
          <input
            type="number"
            value={winnersCount}
            onChange={(e) => setWinnersCount(Number(e.target.value))}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label>Total Amount (SOL)</label>
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(Number(e.target.value))}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label>Author Nickname</label>
          <input
            type="text"
            value={authorNickname}
            onChange={(e) => setAuthorNickname(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Create Red Pack
        </button>
      </form>
    </div>
  );
}
