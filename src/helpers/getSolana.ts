export interface Solana {
    publicKey: string;
    signTransaction(transaction: import("@solana/web3.js").Transaction): Promise<import("@solana/web3.js").Transaction>;
  }

export function getSolana() {
    return Reflect.get(window, 'solana') as Solana | undefined;
}