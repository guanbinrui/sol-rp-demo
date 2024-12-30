export interface Solana {
  isConnected: boolean;
  publicKey: string;
  connect(): Promise<void>;
  signTransaction(
    transaction: import("@solana/web3.js").Transaction,
  ): Promise<import("@solana/web3.js").Transaction>;
}

export async function getSolana() {
  const solana = Reflect.get(window, "solana") as Solana | undefined;
  if (!solana) throw new Error("No solana client found");
  if (!solana.isConnected) await solana.connect();

  return solana;
}
