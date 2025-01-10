"use client";

import { getSolana } from "@/helpers/getSolana";
import { lamportsToSol } from "@/helpers/lamportsToSol";
import { fetchRedPackets } from "@/lib/fetchRedPackets";
import { web3 } from "@coral-xyz/anchor";
import { useEffect, useState } from "react";

export default function ListRedPacks() {
  const [account, setAccount] = useState<web3.PublicKey | null>(null);
  const [redPacks, setRedPacks] = useState<
    UnboxPromise<ReturnType<typeof fetchRedPackets>>
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const solana = await getSolana();
      setAccount(solana.publicKey);

      console.log("DEBUG: creator");
      console.log(solana.publicKey.toBase58());

      const data = await fetchRedPackets(solana.publicKey);

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

      {!redPacks.length ? <p>No Data</p> : null}

      <ul>
        {redPacks.map((pack, index) => {
          const isExpired = pack.account.duration
            .add(pack.account.createTime)
            .muln(1000)
            .ltn(Date.now());
          const isEmpty = pack.account.claimedAmount.gt(
            pack.account.totalAmount,
          );

          return (
            <li key={index} className="border p-4 my-2 rounded-md">
              <div>
                <p>
                  Create At:{" "}
                  {new Date(
                    pack.account.createTime.muln(1000).toNumber(),
                  ).toLocaleString()}
                </p>
                <p>Account ID: {pack.publicKey.toBase58()}</p>
                <p>Creator: {pack.account.creator.toBase58()}</p>
                <p>
                  Claimer: {pack.account.pubkeyForClaimSignature.toBase58()}
                </p>
                <p>
                  Amount: {lamportsToSol(pack.account.claimedAmount)} /{" "}
                  {lamportsToSol(pack.account.totalAmount)} SOL
                </p>
                <p>
                  Count: {pack.account.claimedNumber} /{" "}
                  {pack.account.totalNumber.toString()}
                </p>
                <p>Duration: {pack.account.duration.toString()}</p>
                <p>Author: {pack.account.name}</p>
                <p>Message: {pack.account.message}</p>
                <p>
                  Is splited: {pack.account.ifSpiltRandom ? "true" : "false"}
                </p>
                <p>Is expired: {JSON.stringify(isExpired)}</p>
                <p>Is empty: {JSON.stringify(isEmpty)}</p>
              </div>
              <div className=" mt-2">
                {!isExpired ? (
                  <button className=" border border-line rounded-sm py-1 px-2 ">
                    Claim
                  </button>
                ) : null}
                {account && pack.account.creator.equals(account) ? (
                  <button className=" border border-line rounded-sm py-1 px-2 ml-2">
                    Refund
                  </button>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
