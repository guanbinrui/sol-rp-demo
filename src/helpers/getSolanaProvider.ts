import { getSolana } from "@/helpers/getSolana";
import { Connection, clusterApiUrl } from "@solana/web3.js";

import { AnchorProvider } from "@coral-xyz/anchor";

export async function getSolanaProvider() {
  const solana = await getSolana();

  const network = "devnet"; // Change to 'mainnet-beta' for mainnet
  const connection = new Connection(clusterApiUrl(network), "confirmed");
  const wallet = {
    publicKey: solana.publicKey,
    signTransaction: solana.signTransaction,
    signAllTransactions: solana.signAllTransactions,
  };
  return new AnchorProvider(connection, wallet, {});
}
