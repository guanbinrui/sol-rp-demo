import { web3 } from "@coral-xyz/anchor";
import { parseJSON } from "@/helpers/parseJSON";

export function getRpKeyPair(accountId: web3.PublicKey) {
  const item = localStorage.getItem(`rpKeyPair-${accountId.toBase58()}`);
  if (!item) return null;

  const parsed = parseJSON<{
    publicKey: string; // base58
    secretKey: string; // hex
  }>(item);
  if (!parsed) return null;

  return web3.Keypair.fromSecretKey(
    Uint8Array.from(Buffer.from(parsed.secretKey, "hex")),
  );
}

export function setRpKeyPair(accountId: web3.PublicKey, keyPair: web3.Keypair) {
  localStorage.setItem(
    `rpKeyPair-${accountId.toBase58()}`,
    JSON.stringify({
      publicKey: keyPair.publicKey.toBase58(),
      secretKey: Buffer.from(keyPair.secretKey).toString("hex"),
    }),
  );
}
