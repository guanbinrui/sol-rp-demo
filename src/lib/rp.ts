import { PublicKey, Connection } from "@solana/web3.js";

import { Idl, Program } from "@coral-xyz/anchor";
import { getSolanaProvider } from "@/helpers/getSolanaProvider";

import idl from "@/idl/rp.json";
import { Redpacket } from "@/idl/rp";
import { BN } from "bn.js";

const MAX_NUM = 1000; // Maximum number of red packets (constant)
const MAX_AMOUNT = 1000000000; // Maximum amount of red packets (constant)

// Function to create a red packet with native tokens
export async function createRedPacketWithNativeToken(
  signer: PublicKey, // This would be the user sending the transaction
  totalNumber: number, // Total number of red packets
  totalAmount: number, // Total amount in lamports (1 SOL = 10^9 lamports)
  createTime: number, // unix timestamp
  duration: number, // in seconds
  ifSpiltRandom: boolean, // Whether to split randomly
  pubkeyForClaimSignature: PublicKey, // Public key to be used for claim signature
) {
  // Ensure the totalNumber and totalAmount are within the acceptable range
  if (totalNumber > MAX_NUM) {
    throw new Error(`Total number of red packets cannot exceed ${MAX_NUM}`);
  }
  if (totalAmount > MAX_AMOUNT) {
    throw new Error(`Total amount of red packets cannot exceed ${MAX_AMOUNT}`);
  }

  const anchorProvider = await getSolanaProvider();
  const program = new Program(idl as Redpacket, anchorProvider);

  const signature = await program.methods
    .createRedPacketWithNativeToken(
      new BN(totalNumber),
      new BN(totalAmount),
      new BN(createTime),
      new BN(duration),
      ifSpiltRandom,
      pubkeyForClaimSignature,
    )
    .accounts({
      signer,
    })
    .rpc();

  console.log("The transaction signature is: ", signature);

  return signature;
}
