import { lamportsToSol } from "@/helpers/lamportsToSol";
import { claimWithNativeToken } from "@/lib/claimWithNativeToken";
import { claimWithSplToken } from "@/lib/claimWithSplToken";
import { fetchRedPackets } from "@/lib/fetchRedPackets";
import { refundWithNativeToken } from "@/lib/refundWithNativeToken";
import { refundWithSplToken } from "@/lib/refundWithSplToken";
import { fetchClaimRecord } from "@/lib/fetchClaimRecord";
import { web3 } from "@coral-xyz/anchor";
import { useAsync, useAsyncFn } from "react-use";

interface PacketProps {
  account: web3.PublicKey | null;
  packet: UnboxPromise<ReturnType<typeof fetchRedPackets>>[0];
}

export function Packet({ account, packet }: PacketProps) {
  const { loading: loadingClaimRecord, value: cliamRecord } =
    useAsync(async () => {
      if (!account) return null;
      const record = await fetchClaimRecord(packet.publicKey, account);
      return record;
    }, [account, packet.publicKey.toBase58()]);

  const [{ loading: pendingClaim }, onClaim] = useAsyncFn(
    async (type: 0 | 1, accountId: web3.PublicKey) => {
      if (!account) throw new Error("No account found");

      try {
        switch (type) {
          case 0:
            await claimWithNativeToken(accountId, account);
            break;
          case 1:
            await claimWithSplToken(
              accountId,
              account,
              packet.account.tokenAddress,
            );
            break;
        }
      } catch (error) {
        console.error("Claim failed: ", error);
        throw error;
      }
    },
    [account],
  );

  const [{ loading: pendingRefund }, onRefund] = useAsyncFn(
    async (type: 0 | 1, accountId: web3.PublicKey) => {
      if (!account) throw new Error("No account found");

      try {
        switch (type) {
          case 0:
            await refundWithNativeToken(accountId, account);
            break;
          case 1:
            await refundWithSplToken(
              accountId,
              account,
              packet.account.tokenAddress,
            );
            break;
        }
      } catch (error) {
        console.error("Claim failed: ", error);
        throw error;
      }
    },
    [account],
  );

  const isExpired = packet.account.duration
    .add(packet.account.createTime)
    .muln(1000)
    .ltn(Date.now());
  const isEmpty = packet.account.claimedAmount.gt(packet.account.totalAmount);

  return (
    <li className="border p-4 my-2 rounded-md">
      <div>
        <p>
          Create At:{" "}
          {new Date(
            packet.account.createTime.muln(1000).toNumber(),
          ).toLocaleString()}
        </p>
        <p>Account ID: {packet.publicKey.toBase58()}</p>
        <p>Creator: {packet.account.creator.toBase58()}</p>
        <p>Claimer: {packet.account.pubkeyForClaimSignature.toBase58()}</p>
        <p>
          Amount: {lamportsToSol(packet.account.claimedAmount)} /{" "}
          {lamportsToSol(packet.account.totalAmount)}
        </p>
        <p>Token Type: {packet.account.tokenType === 0 ? "Native" : "SPL"}</p>
        <p>Token Address: {packet.account.tokenAddress.toBase58()}</p>
        <p>
          Count: {packet.account.claimedNumber} /{" "}
          {packet.account.totalNumber.toString()}
        </p>
        <p>Duration: {packet.account.duration.toString()}</p>
        <p>Author: {packet.account.name}</p>
        <p>Message: {packet.account.message}</p>
        <p>Is splited: {packet.account.ifSpiltRandom ? "true" : "false"}</p>
        <p>Is expired: {JSON.stringify(isExpired)}</p>
        <p>
          Is cliamed:{" "}
          {loadingClaimRecord ? "Loading..." : cliamRecord ? "true" : "false"}
        </p>
        <p>Is empty: {JSON.stringify(isEmpty)}</p>
      </div>
      {account ? (
        <div className=" mt-2">
          {!isExpired ? (
            <button
              className="mr-2 bg-blue-500 text-white rounded-md py-1 px-4"
              disabled={pendingClaim}
              onClick={() => {
                onClaim(packet.account.tokenType as 0 | 1, packet.publicKey);
              }}
            >
              {pendingClaim ? "Claiming..." : "Claim"}
            </button>
          ) : null}
          {account && packet.account.creator.equals(account) ? (
            <button
              className="mr-2 bg-blue-500 text-white rounded-md py-1 px-4"
              disabled={pendingRefund}
              onClick={() => {
                onRefund(packet.account.tokenType as 0 | 1, packet.publicKey);
              }}
            >
              {pendingRefund ? "Refunding..." : "Refund"}
            </button>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}
