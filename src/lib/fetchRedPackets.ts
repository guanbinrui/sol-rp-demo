import { getRpProgram } from "@/helpers/getRpProgram";
import { web3 } from "@coral-xyz/anchor";

export async function fetchRedPackets(creator: web3.PublicKey) {
  console.log("DEBUG: creator");
  console.log({
    creator: creator.toBase58(),
  });

  const program = await getRpProgram();

  const redPackets = await program.account.redPacket.all([
    {
      memcmp: {
        offset: 8, // Adjust the offset based on your account structure
        bytes: creator.toBase58(),
      },
    },
  ]);
  return redPackets;
}
