"use client";

import { getSolana } from "@/helpers/getSolana";
import { fetchRedPackets } from "@/lib/fetchRedPackets";
import { web3 } from "@coral-xyz/anchor";
import { useState } from "react";
import { useAsync } from "react-use";
import { Packet } from "@/app/packets/Packet";

export default function ListRedPacks() {
  const [account, setAccount] = useState<web3.PublicKey | null>(null);

  const {
    loading,
    value: redPacks = [],
    error,
  } = useAsync(async () => {
    const solana = await getSolana();
    setAccount(solana.publicKey);

    const items = await fetchRedPackets(solana.publicKey);
    return items;
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Red Packs</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : !redPacks.length ? (
        <p>No Data</p>
      ) : (
        <ul>
          {redPacks.map((packet) => (
            <Packet
              key={packet.publicKey.toBase58()}
              account={account}
              packet={packet}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
