import { getRpProgram } from "@/helpers/getRpProgram";
import { web3 } from "@coral-xyz/anchor";

export async function fetchRedPackets(creator: web3.PublicKey) {
  const program = await getRpProgram();

  const redPackets = await program.account.redPacket.all([
    {
      memcmp: {
        offset: 8, // Adjust the offset based on your account structure
        bytes: creator.toBase58(),
      },
    },
  ]);

  console.log("DEBUG: redPackets", redPackets);

  return redPackets;
}
