"use client";

import { getSolana } from "@/helpers/getSolana";
import { fetchRedPackets } from "@/lib/fetchRedPackets";
import { useEffect, useState } from "react";

export default function ListRedPacks() {
  const [redPacks, setRedPacks] = useState<
    UnboxPromise<ReturnType<typeof fetchRedPackets>>
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const solana = await getSolana();

      console.log("DEBUG: creator");
      console.log(solana.publicKey.toBase58());

      const data = await fetchRedPackets();

      console.log("DEBUG: data");
      console.log({
        data,
      });

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
            <p>Creator: {pack.creator.toBase58()}</p>
            <p>Total Amount: {pack.totalAmount.toString()} LAMPS</p>
            <p>Total Count: {pack.totalNumber.toString()}</p>
            <p>Duration: {pack.duration.toString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
