"use client";

import { useState } from "react";
import { Keypair, PublicKey } from "@solana/web3.js";
import { createRedPacketWithNativeToken } from "@/lib/rp";
import { getSolana } from "@/helpers/getSolana";

const { publicKey, secretKey } = Keypair.generate();

export default function CreateRedPack() {
  const [winnersCount, setWinnersCount] = useState<number | "">(1);
  const [totalAmount, setTotalAmount] = useState<number | "">(0.0001);
  const [ifSpiltRandom, setIfSpiltRandom] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!winnersCount || !totalAmount) {
      alert("Please fill all fields correctly.");
      return;
    }

    try {
      const solana = await getSolana();
      const signature = await createRedPacketWithNativeToken(
        solana.publicKey,
        winnersCount,
        totalAmount * 1e9,
        Math.floor(Date.now() / 1000),
        3600,
        ifSpiltRandom,
        publicKey,
      );
      alert(`Red Pack Created! Transaction Signature: ${signature}`);
    } catch (error) {
      console.error("Error creating Red Pack:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Create a Red Pack</h1>
      <form className="space-y-4 text-back dark:text-white">
        <div>
          <label>Private Key</label>
          <input
            type="text"
            value={Buffer.from(secretKey).toString("hex")}
            onChange={() => {}}
            className=" text-black border p-2 w-full"
          />
        </div>
        <div>
          <label>Winners Count</label>
          <input
            type="number"
            value={winnersCount}
            onChange={(e) => setWinnersCount(Number(e.target.value))}
            className=" text-black border p-2 w-full"
          />
        </div>
        <div>
          <label>Total Amount (SOL)</label>
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(Number(e.target.value))}
            className=" text-black border p-2 w-full"
          />
        </div>
        <div>
          <label className="mr-2">If Split Random</label>
          <input
            type="checkbox"
            checked={ifSpiltRandom}
            onChange={(e) => setIfSpiltRandom(e.target.checked)}
            className=" text-black border p-2"
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
