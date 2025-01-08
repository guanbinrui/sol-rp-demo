import { PublicKey } from "@solana/web3.js";

import { getSolanaProvider } from "@/helpers/getSolanaProvider";

import idl from "@/idl/rp.json";
import { BN } from "bn.js";
import { RedPack, RedPacketAccount } from "@/type/rp";
import { getRpProgram } from "@/helpers/getRpProgram";

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

  const program = await getRpProgram();
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

export async function fetchRedPacks(
  creator: PublicKey,
): Promise<RedPack[] | null> {
  const anchorProvider = await getSolanaProvider();
  const program = await getRpProgram();

  // Fetch all accounts owned by the program
  const accounts = await anchorProvider.connection.getProgramAccounts(
    new PublicKey(idl.address),
  );

  console.log("DEBUG: accounts");
  console.log({
    accounts,
    creator,
  });

  // Parse and deserialize account data
  return accounts.map((account) => {
    const data = program.coder.accounts.decode<RedPacketAccount>(
      "RedPacket",
      account.account.data,
    );

    return {
      creator: data.creator.toBase58(),
      totalNumber: data.totalNumber.toNumber(),
      claimedNumber: data.claimedNumber.toNumber(),
      totalAmount: data.totalAmount.toNumber(),
      claimedAmount: data.claimedAmount.toNumber(),
      createTime: data.createTime.toNumber(),
      duration: data.duration.toNumber(),
      tokenType: data.tokenType === 1 ? "SPL" : "Native",
      tokenMint: data.tokenMint ? data.tokenMint.toBase58() : null,
      claimedUsers: data.claimedUsers.map((user: PublicKey) => user.toBase58()),
      claimedAmountRecords: data.claimedAmountRecords.map((record) =>
        record.toNumber(),
      ),
    } as RedPack;
  });
}
