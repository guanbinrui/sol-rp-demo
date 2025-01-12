import { web3 } from "@coral-xyz/anchor";
import { getSolanaProvider } from "@/helpers/getSolanaProvider";

async function getTokenAccounts(tokenMint: web3.PublicKey) {
  const provider = await getSolanaProvider();
  const accounts = await provider.connection.getTokenAccountsByOwner(
    provider.publicKey,
    {
      mint: new web3.PublicKey(tokenMint),
    },
  );

  return accounts.value;
}

export async function getTokenAccount(tokenMint: web3.PublicKey) {
  const accounts = await getTokenAccounts(tokenMint);
  if (!accounts.length) return null;

  return accounts[0].pubkey;
}

export async function getTokenProgram(tokenMint: web3.PublicKey) {
  const accounts = await getTokenAccounts(tokenMint);
  if (!accounts.length) return null;

  return accounts[0].account.owner;
}

export async function getOwnerOfTokenAccount(tokenAccount: web3.PublicKey) {
  const provider = await getSolanaProvider();
  const accountInfo = await provider.connection.getAccountInfo(
    new web3.PublicKey(tokenAccount),
  );
  if (!accountInfo) return null;

  return accountInfo.owner;
}
