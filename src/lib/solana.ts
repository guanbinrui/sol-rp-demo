import { getSolana } from "@/helpers/getSolana";
import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";

const PROGRAM_ID = new PublicKey("CXT16oAAbmgpPZsL2sGmfSUNrATk3AsFVU18thTUVNxx");
const CLUSTER = "https://api.devnet.solana.com";
const connection = new Connection(CLUSTER, "confirmed");

export interface RedPack {
  winnersCount: number;
  totalAmount: number;
  authorNickname: string;
  expiresAt: string;
}

/**
 * Creates a red packet on the Solana blockchain.
 * @param winnersCount Number of winners for the red packet.
 * @param totalAmount Total amount of SOL for the red packet.
 * @param authorNickname Author's nickname.
 * @param payer Public key of the payer (wallet).
 * @returns Transaction signature.
 */
export async function createRedPack(
  winnersCount: number,
  totalAmount: number,
  authorNickname: string,
  payer: PublicKey
): Promise<string> {
  const instructionData = Buffer.from(
    JSON.stringify({ winnersCount, totalAmount, authorNickname })
  );

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: payer,
      toPubkey: PROGRAM_ID,
      lamports: totalAmount * 1e9, // Convert SOL to lamports.
    }),
    {
      keys: [],
      programId: PROGRAM_ID,
      data: instructionData,
    }
  );

  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = payer;

  const solana = getSolana()
  if (!solana) throw new Error('No solana client found');

  const signedTransaction = await solana.signTransaction(transaction);
  const signature = await connection.sendRawTransaction(signedTransaction.serialize());
  await connection.confirmTransaction(signature);

  return signature;
}

/**
 * Fetches created red packets from the Solana blockchain.
 * @returns List of red packets.
 */
export async function fetchRedPacks(): Promise<RedPack[]> {
  const accounts = await connection.getProgramAccounts(PROGRAM_ID);

  return accounts.map((account) => {
    const decodedData = JSON.parse(account.account.data.toString("utf-8"));
    return {
      winnersCount: decodedData.winnersCount,
      totalAmount: decodedData.totalAmount / 1e9, // Convert lamports to SOL.
      authorNickname: decodedData.authorNickname,
      expiresAt: new Date(decodedData.expiresAt * 1000).toLocaleString(), // Convert timestamp to human-readable.
    };
  });
}