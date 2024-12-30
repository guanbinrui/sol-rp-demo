declare global {
  interface Solana {
    publicKey: string;
    signTransaction(transaction: import("@solana/web3.js").Transaction): Promise<import("@solana/web3.js").Transaction>;
  }

  var solana: Solana | undefined;
}
