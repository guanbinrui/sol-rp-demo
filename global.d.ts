declare global {
  interface Solana {
    publicKey: string;
    signTransaction(
      transaction: import("@coral-xyz/anchor").web3.Transaction,
    ): Promise<import("@coral-xyz/anchor").web3.Transaction>;
  }

  var solana: Solana | undefined;
}

type UnboxPromise<T> = T extends Promise<infer U> ? U : T;
