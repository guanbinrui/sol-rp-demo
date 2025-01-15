"use client";

import { useState } from "react";
import { web3 } from "@coral-xyz/anchor";
import { createWithNativeToken } from "@/lib/createWithNativeToken";
import { getSolana } from "@/helpers/getSolana";
import Link from "next/link";
import { setRpKeyPair } from "@/helpers/getRpKeyPair";
import { useAsync, useAsyncFn } from "react-use";
import { getTokenAccount } from "@/helpers/getTokenAccount";
import { getTokenBalance } from "@/helpers/getTokenBalance";
import { createWithSplToken } from "@/lib/createWithSplToken";

const claimer = web3.Keypair.generate();

export default function CreateRedPack() {
  const [account, setAccount] = useState("");
  const [ifSPL, setIfSPL] = useState(false);
  const [tokenMint, setTokenMint] = useState(
    new web3.PublicKey("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"),
  );
  const [tokenBalance, setTokenBalance] = useState(0);
  const [winnersCount, setWinnersCount] = useState(3);
  const [totalAmount, setTotalAmount] = useState(0.0001);
  const [ifSpiltRandom, setIfSpiltRandom] = useState(false);
  const [message, setMessage] = useState("Best Wishes!");
  const [author, setAuthor] = useState("Vitalik Buterin");

  useAsync(async () => {
    const solana = await getSolana();
    setAccount(solana.publicKey.toBase58());
  }, []);

  useAsync(async () => {
    if (!tokenMint) return;

    const tokenAccount = await getTokenAccount(tokenMint);
    if (!tokenAccount) return;

    const tokenBalance = await getTokenBalance(tokenAccount);
    setTokenBalance(tokenBalance.uiAmount ?? 0);
  }, [tokenMint]);

  const [{ loading }, handleCreate] = useAsyncFn(async () => {
    if (!winnersCount || !totalAmount) {
      console.log("Please fill all fields correctly.");
      return;
    }

    const solana = await getSolana();

    if (ifSPL) {
      try {
        const { accountId } = await createWithSplToken(
          solana.publicKey,
          tokenMint,
          winnersCount,
          totalAmount * web3.LAMPORTS_PER_SOL,
          1000 * 60 * 60 * 24, // 24 hours
          ifSpiltRandom,
          claimer.publicKey,
          message,
          author,
        );

        setRpKeyPair(accountId, claimer);
      } catch (error) {
        console.error("Error creating Red Pack:", error);
        throw error;
      }
    } else {
      try {
        const { accountId } = await createWithNativeToken(
          solana.publicKey,
          winnersCount,
          totalAmount * web3.LAMPORTS_PER_SOL,
          1000 * 60 * 60 * 24, // 24 hours
          ifSpiltRandom,
          claimer.publicKey,
          message,
          author,
        );

        setRpKeyPair(accountId, claimer);
      } catch (error) {
        console.error("Error creating Red Pack:", error);
        throw error;
      }
    }
  }, [
    winnersCount,
    totalAmount,
    ifSpiltRandom,
    ifSPL,
    tokenMint,
    message,
    author,
  ]);

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
          <label>Account</label>
          <input
            type="text"
            readOnly
            value={account}
            onChange={() => {}}
            className=" text-black border p-2 w-full"
          />
        </div>
        <div>
          <label>Claimer Private Key</label>
          <input
            type="text"
            value={Buffer.from(claimer.secretKey).toString("hex")}
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
        {ifSPL ? (
          <div>
            <label>SPL Token Mint</label>
            <input
              type="text"
              value={tokenMint.toBase58()}
              onChange={(e) => setTokenMint(new web3.PublicKey(e.target.value))}
              className=" text-black border p-2 w-full"
            />
            <p className="text-sm text-gray-500">
              Try to claim some SPL tokens{" "}
              <Link
                target="_blank"
                href="https://spl-token-faucet.com/"
                className="underline"
              >
                here
              </Link>
              .
            </p>
          </div>
        ) : null}
        <div>
          <label>Total Amount {ifSPL ? "" : "(SOL)"}</label>
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(Number(e.target.value))}
            className=" text-black border p-2 w-full"
          />
          {ifSPL ? (
            <p className="text-sm text-gray-500">Balance: {tokenBalance}</p>
          ) : null}
        </div>
        <div>
          <label className="mr-2">Message</label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className=" text-black border p-2 w-full"
          />
        </div>
        <div>
          <label className="mr-2">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className=" text-black border p-2 w-full"
          />
        </div>
        <div className=" flex ">
          <div className="mr-4">
            <label className="mr-2">If Split Random</label>
            <input
              type="checkbox"
              checked={ifSpiltRandom}
              onChange={(e) => setIfSpiltRandom(e.target.checked)}
              className=" text-black border p-2"
            />
          </div>
          <div className="mr-4">
            <label className="mr-2">If SPL Token</label>
            <input
              type="checkbox"
              checked={ifSPL}
              onChange={(e) => setIfSPL(e.target.checked)}
              className=" text-black border p-2"
            />
          </div>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2"
        >
          {loading ? "Creating..." : "Create Packet"}
        </button>
      </form>
    </div>
  );
}
