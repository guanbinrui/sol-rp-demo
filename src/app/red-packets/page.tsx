"use client";

import { getSolana } from "@/helpers/getSolana";
import { fetchRedPacks } from "@/lib/rp";
import { RedPack } from "@/type/rp";
import { useEffect, useState } from "react";

export default function ListRedPacks() {
  const [redPacks, setRedPacks] = useState<RedPack[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const solana = await getSolana();
      const data = await fetchRedPacks(solana.publicKey);
      setRedPacks(data ?? []);
    };
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Red Packs</h1>
      <ul>
        {redPacks.map((pack, index) => (
          <li key={index} className="border p-4 my-2">
            <p>Creator: {pack.creator}</p>
            <p>Total Amount: {pack.totalAmount} SOL</p>
            <p>Total Count: {pack.totalNumber}</p>
            <p>Duration: {pack.duration}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
