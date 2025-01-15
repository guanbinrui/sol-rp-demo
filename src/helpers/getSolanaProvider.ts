import { getSolana } from "@/helpers/getSolana";
import { web3 } from "@coral-xyz/anchor";

import { AnchorProvider } from "@coral-xyz/anchor";

export async function getSolanaProvider() {
  const solana = await getSolana();

  const network = "devnet"; // Change to 'mainnet-beta' for mainnet
  const connection = new web3.Connection(
    'https://chaotic-solemn-sound.solana-devnet.quiknode.pro/4fc40f8f7d6d57cdc6735ea81a39e07f1fdafc2e',
    "confirmed",
  );
  const wallet = {
    publicKey: solana.publicKey,
    signTransaction: solana.signTransaction,
    signAllTransactions: solana.signAllTransactions,
  };
  return new AnchorProvider(connection, wallet, {});
}
