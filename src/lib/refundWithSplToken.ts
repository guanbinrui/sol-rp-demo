import { getRpProgram } from "@/helpers/getRpProgram";
import { getTokenAccount, getTokenProgram } from "@/helpers/getTokenAccount";
import { web3 } from "@coral-xyz/anchor";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";

export async function refundWithSplToken(
  accountId: web3.PublicKey,
  creator: web3.PublicKey,
) {
  const program = await getRpProgram();

  const tokenMint = new web3.PublicKey(
    "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr",
  );

  const tokenAccount = await getTokenAccount(tokenMint);
  if (!tokenAccount) throw new Error("Token account not found");
  console.log("DEBUG: tokenAccount", tokenAccount.toBase58());

  const tokenProgram = await getTokenProgram(tokenMint);
  if (!tokenProgram) throw new Error("Token program not found");
  console.log("DEBUG: tokenProgram", tokenProgram.toBase58());

  const vault = getAssociatedTokenAddressSync(
    tokenMint,
    accountId,
    true,
    tokenProgram,
  );

  const signature = await program.methods
    .withdrawWithSplToken()
    .accounts({
      // @ts-expect-error missing type
      redPacket: accountId,
      signer: creator,
      vault,
      tokenAccount, // Will be created if it doesn't exist
      tokenMint,
      tokenProgram,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    })
    .rpc();

  console.log("The transaction signature is: ", signature);
  return signature;
}
