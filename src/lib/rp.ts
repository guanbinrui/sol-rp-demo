import { getSolanaProvider } from "@/helpers/getSolanaProvider";

import { BN, web3 } from "@coral-xyz/anchor";
import idl from "@/idl/rp.json";
import { RedPack, RedPacketAccount } from "@/type/rp";
import { getRpProgram } from "@/helpers/getRpProgram";

const MAX_NUM = 1000; // Maximum number of red packets (constant)
const MAX_AMOUNT = 1000000000; // Maximum amount of red packets (constant)

// Function to create a red packet with native tokens
export async function createRedPacketWithNativeToken(
  creator: web3.PublicKey, // This would be the user sending the transaction
  totalNumber: number, // Total number of red packets
  totalAmount: number, // Total amount in lamports (1 SOL = 10^9 lamports)
  createTime: number, // unix timestamp
  duration: number, // in seconds
  ifSpiltRandom: boolean, // Whether to split randomly
  pubkeyForClaimSignature: web3.PublicKey, // Public key to be used for claim signature
) {
  // Ensure the totalNumber and totalAmount are within the acceptable range
  if (totalNumber > MAX_NUM) {
    throw new Error(`Total number of red packets cannot exceed ${MAX_NUM}`);
  }
  if (totalAmount > MAX_AMOUNT) {
    throw new Error(`Total amount of red packets cannot exceed ${MAX_AMOUNT}`);
  }

  const program = await getRpProgram();
  const nativeTokenRedPacket = web3.PublicKey.findProgramAddressSync(
    [creator.toBuffer(), Buffer.from(new BN(createTime).toArray("le", 8))],
    program.programId,
  )[0];

  console.log("DEBUG: createRedPacketWithNativeToken");
  console.log({
    totalNumber,
    totalAmount,
    createTime,
    duration,
    ifSpiltRandom,
    pubkeyForClaimSignature: pubkeyForClaimSignature.toBase58(),
    nativeTokenRedPacket: nativeTokenRedPacket.toBase58(),
    programId: program.programId.toBase58(),
    system: web3.SystemProgram.programId.toBase58(),
  });

  const signature = await program.methods
    .createRedPacketWithNativeToken(
      totalNumber,
      new BN(totalAmount),
      new BN(createTime),
      new BN(duration),
      ifSpiltRandom,
      pubkeyForClaimSignature,
    )
    .accounts({
      signer: creator,
      // @ts-expect-error missing type
      redPacket: nativeTokenRedPacket,
      systemProgram: web3.SystemProgram.programId,
    })
    .rpc({
      commitment: "confirmed",
    });

  console.log("The transaction signature is: ", signature);

  return signature;
}

export async function fetchRedPacks(
  creator: web3.PublicKey,
): Promise<RedPack[] | null> {
  const anchorProvider = await getSolanaProvider();
  const program = await getRpProgram();

  // Fetch all accounts owned by the program
  const accounts = await anchorProvider.connection.getProgramAccounts(
    new web3.PublicKey(idl.address),
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
      claimedUsers: data.claimedUsers.map((user: web3.PublicKey) =>
        user.toBase58(),
      ),
      claimedAmountRecords: data.claimedAmountRecords.map((record) =>
        record.toNumber(),
      ),
    } as RedPack;
  });
}
