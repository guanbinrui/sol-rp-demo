import { getRpProgram } from "@/helpers/getRpProgram";
import { web3 } from "@coral-xyz/anchor";

export async function fetchRedPackets() {
  const program = await getRpProgram();

  const redPacket = await program.account.redPacket.fetch(
    new web3.PublicKey("FHKgmXEUqf5j1Xc82kz5NpRHfScL4FsGFA93R8ZhtcTa"),
  );
  return [redPacket];
}
