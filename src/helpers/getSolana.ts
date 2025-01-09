import { web3 } from "@coral-xyz/anchor";

export interface Solana {
  isConnected: boolean;
  publicKey: web3.PublicKey;
  connect(): Promise<void>;
  signTransaction: <T extends web3.Transaction | web3.VersionedTransaction>(
    transaction: T,
  ) => Promise<T>;
  signAllTransactions: <T extends web3.Transaction | web3.VersionedTransaction>(
    transactions: Array<T>,
  ) => Promise<Array<T>>;
  signAndSendTransaction: <
    T extends web3.Transaction | web3.VersionedTransaction,
  >(
    transaction: T,
  ) => Promise<string>;
}

export async function getSolana() {
  const solana = Reflect.get(window, "solana") as Solana | undefined;
  if (!solana) throw new Error("No solana client found");
  if (!solana.isConnected) await solana.connect();

  return solana;
}
