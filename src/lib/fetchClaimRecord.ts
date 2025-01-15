import { getRpProgram } from "@/helpers/getRpProgram";
import { web3 } from "@coral-xyz/anchor";

export async function fetchClaimRecord(
  accountId: web3.PublicKey,
  receiver: web3.PublicKey,
) {
  const program = await getRpProgram();
  const claimRecordAccount = web3.PublicKey.findProgramAddressSync(
    [Buffer.from("claim_record"), accountId.toBuffer(), receiver.toBuffer()],
    program.programId,
  )[0];

  try {
    const claimRecord =
      await program.account.claimRecord.fetch(claimRecordAccount);
    return claimRecord;
  } catch {
    return null;
  }
}
