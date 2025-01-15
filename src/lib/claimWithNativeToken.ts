import { getRpKeyPair } from "@/helpers/getRpKeyPair";
import { getRpProgram } from "@/helpers/getRpProgram";
import { web3 } from "@coral-xyz/anchor";
import nacl from "tweetnacl";

export async function claimWithNativeToken(
  accountId: web3.PublicKey,
  receiver: web3.PublicKey,
) {
  const claimer = getRpKeyPair(accountId);
  if (!claimer) throw new Error("No claimer found");

  const message = Buffer.concat([accountId.toBytes(), receiver.toBytes()]);

  const claimerSignature = nacl.sign.detached(message, claimer.secretKey);

  const verified = nacl.sign.detached.verify(
    message,
    claimerSignature,
    claimer.publicKey.toBytes(),
  );
  console.log("DEBUG: verified", verified);

  const ed25519Instruction = web3.Ed25519Program.createInstructionWithPublicKey(
    {
      publicKey: claimer.publicKey.toBytes(),
      message: message,
      signature: claimerSignature,
    },
  );

  const program = await getRpProgram();
  const signature = await program.methods
    .claimWithNativeToken()
    .accounts({
      // @ts-expect-error missing type
      redPacket: accountId,
      signer: receiver,
      systemProgram: web3.SystemProgram.programId,
    })
    .preInstructions([ed25519Instruction])
    .rpc();

  console.log("The transaction signature is: ", signature);

  return signature;
}
