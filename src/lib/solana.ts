import { getSolana } from "@/helpers/getSolana";
import {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  Connection,
} from "@solana/web3.js";
import { Buffer } from "buffer";

// Define constant values
const PROGRAM_ID = new PublicKey(
  "CXT16oAAbmgpPZsL2sGmfSUNrATk3AsFVU18thTUVNxx",
); // Program ID
const SEED = "redPacketSeed"; // Seed used for deriving the PDA
const MAX_NUM = 1000; // Maximum number of red packets (constant)
const MAX_AMOUNT = 1000000000; // Maximum amount of red packets (constant)

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

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

  // Derive the PDA (Program Derived Address)
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from(SEED)],
    PROGRAM_ID,
  );

  // Create the transaction instruction to invoke the program
  const instruction = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: signer, isSigner: true, isWritable: true },
      { pubkey: pda, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    data: Buffer.from(
      // Encode the arguments passed to the create_red_packet_with_native_token function
      // Create the Buffer with the appropriate data layout
      Buffer.concat([
        Buffer.from([totalNumber]), // total_number
        Buffer.from(
          Uint8Array.from(
            new Array(8)
              .fill(0)
              .map((_, i) => (totalAmount >> (8 * (7 - i))) & 0xff),
          ),
        ), // total_amount as 8 bytes
        Buffer.from(
          Uint8Array.from(
            new Array(8)
              .fill(0)
              .map((_, i) => (createTime >> (8 * (7 - i))) & 0xff),
          ),
        ), // create_time as 8 bytes
        Buffer.from(
          Uint8Array.from(
            new Array(8)
              .fill(0)
              .map((_, i) => (duration >> (8 * (7 - i))) & 0xff),
          ),
        ), // duration as 8 bytes
        Buffer.from([ifSpiltRandom ? 1 : 0]), // if_spilt_random (1 byte)
        pubkeyForClaimSignature.toBuffer(), // pubkey_for_claim_signature (32 bytes)
      ]),
    ),
  });

  // Send the transaction
  const { blockhash } = await connection.getRecentBlockhash();
  const transaction = new Transaction({
    feePayer: signer,
    recentBlockhash: blockhash,
  }).add(instruction);

  // Sign and send the transaction
  const solana = await getSolana();
  const signature = await solana.signAndSendTransaction(transaction);

  console.log("Transaction successful with signature:", signature);

  return signature;
}

export interface RedPack {
  authorNickname: string;
  totalAmount: string;
  winnersCount: number;
  expiresAt: number;
}

export async function fetchRedPacks() {
  return Promise.resolve<RedPack[]>([]);
}
