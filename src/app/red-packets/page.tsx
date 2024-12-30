"use client";

import { fetchRedPacks, RedPack } from "@/lib/solana";
import { useEffect, useState } from "react";

export default function ListRedPacks() {
  const [redPacks, setRedPacks] = useState<RedPack[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchRedPacks();
      setRedPacks(data);
    };
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Red Packs</h1>
      <ul>
        {redPacks.map((pack, index) => (
          <li key={index} className="border p-4 my-2">
            <p>Author: {pack.authorNickname}</p>
            <p>Total Amount: {pack.totalAmount} SOL</p>
            <p>Winners Count: {pack.winnersCount}</p>
            <p>Expires At: {pack.expiresAt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
