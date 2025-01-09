"use client";

import { useState } from "react";
import { web3 } from "@coral-xyz/anchor";
import { createRedPacketWithNativeToken } from "@/lib/createRedPacketWithNativeToken";
import { getSolana } from "@/helpers/getSolana";
import Link from "next/link";

const { publicKey, secretKey } = web3.Keypair.generate();

export default function CreateRedPack() {
  const [winnersCount, setWinnersCount] = useState(3);
  const [totalAmount, setTotalAmount] = useState(0.0001);
  const [ifSpiltRandom, setIfSpiltRandom] = useState(false);

  const handleSubmit = async () => {
    if (!winnersCount || !totalAmount) {
      console.log("Please fill all fields correctly.");
      return;
    }

    try {
      const solana = await getSolana();

      console.log("DEBUG: create red packet");
      console.log({
        winnersCount,
        totalAmount,
        publicKey: solana.publicKey.toBase58(),
        publicKeyForClaimSignature: publicKey.toBase58(),
      });

      const signature = await createRedPacketWithNativeToken(
        solana.publicKey,
        winnersCount,
        totalAmount * web3.LAMPORTS_PER_SOL,
        Math.floor(Date.now() / 1000) + 3,
        1000 * 60 * 60 * 24, // 24 hours
        ifSpiltRandom,
        publicKey,
      );
      console.log(`Red Pack Created! Transaction Signature: ${signature}`);
    } catch (error) {
      console.error("Error creating Red Pack:", error);
    }
  };

  return (
    <div className="p-4">
      <ul className=" flex">
        <li>
          <Link className=" text-blue-300" href="/">
            Home
          </Link>
        </li>
        <li className=" ml-2">
          <Link className=" text-blue-300" href="/packets">
            Packets
          </Link>
        </li>
      </ul>

      <h1 className=" my-4 text-2xl font-bold">Create a Red Pack</h1>

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
