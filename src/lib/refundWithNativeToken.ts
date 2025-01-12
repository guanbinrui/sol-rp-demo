import { getRpProgram } from "@/helpers/getRpProgram";
import { web3 } from "@coral-xyz/anchor";

export async function refundWithNativeToken(
  accountId: web3.PublicKey,
  creator: web3.PublicKey,
) {
  const program = await getRpProgram();

  const signature = await program.methods
    .withdrawWithNativeToken()
    .accounts({
      // @ts-expect-error missing type
      redPacket: accountId,
      signer: creator,
      systemProgram: web3.SystemProgram.programId,
    })
    .rpc();
  console.log("The transaction signature is: ", signature);

  return signature;
}
