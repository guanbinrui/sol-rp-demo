import { web3 } from "@coral-xyz/anchor";
import BN from "bn.js";

export interface RedPack {
  creator: string;
  totalNumber: number;
  claimedNumber: number;
  totalAmount: number;
  claimedAmount: number;
  createTime: number;
  duration: number;
  tokenType: string;
  tokenMint: string | null;
  claimedUsers: string[];
  claimedAmountRecords: number[];
}

export interface RedPacketAccount {
  creator: web3.PublicKey; // The creator of the red packet
  totalNumber: BN; // Total number of red packets
  claimedNumber: BN; // Number of red packets claimed
  totalAmount: BN; // Total amount in the red packet
  claimedAmount: BN; // Total amount claimed
  createTime: BN; // Timestamp of red packet creation
  duration: BN; // Duration of the red packet's validity
  tokenType: number; // 0 = Native, 1 = SPL
  tokenMint: web3.PublicKey | null; // Token mint address if SPL token
  claimedUsers: web3.PublicKey[]; // List of users who claimed
  claimedAmountRecords: BN[]; // List of claimed amounts
}
