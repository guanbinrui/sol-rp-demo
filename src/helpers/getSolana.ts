import { PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";

export interface Solana {
  isConnected: boolean;
  publicKey: PublicKey;
  connect(): Promise<void>;
  signTransaction: <T extends Transaction | VersionedTransaction>(
    transaction: T,
  ) => Promise<T>;
  signAllTransactions: <T extends Transaction | VersionedTransaction>(
    transactions: Array<T>,
  ) => Promise<Array<T>>;
  signAndSendTransaction: <T extends Transaction | VersionedTransaction>(
    transaction: T,
  ) => Promise<string>;
}

export async function getSolana() {
  const solana = Reflect.get(window, "solana") as Solana | undefined;
  if (!solana) throw new Error("No solana client found");
  if (!solana.isConnected) await solana.connect();

  return solana;
}
