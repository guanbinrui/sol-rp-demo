import { Program } from "@coral-xyz/anchor";
import { getSolanaProvider } from "@/helpers/getSolanaProvider";

import idl from "@/idl/rp.json";
import { Redpacket } from "@/idl/rp";

export async function getRpProgram() {
  const anchorProvider = await getSolanaProvider();
  const program = new Program(idl as Redpacket, anchorProvider);
  return program;
}
