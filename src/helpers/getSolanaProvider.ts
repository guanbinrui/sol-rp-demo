import { getSolana } from "@/helpers/getSolana";
import { web3 } from "@coral-xyz/anchor";

import { AnchorProvider } from "@coral-xyz/anchor";

export async function getSolanaProvider() {
  const solana = await getSolana();

  const network = "devnet"; // Change to 'mainnet-beta' for mainnet
  const connection = new web3.Connection(
    web3.clusterApiUrl(network),
    "confirmed",
  );
  const wallet = {
    publicKey: solana.publicKey,
    signTransaction: solana.signTransaction,
    signAllTransactions: solana.signAllTransactions,
  };
  return new AnchorProvider(connection, wallet, {});
}
