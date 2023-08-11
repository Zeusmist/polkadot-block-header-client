import { ApiPromise } from "@polkadot/api";
import config from "./config";
import { Batch } from "./models/Batch";
import { BlockHeader } from "./models/BlockHeader";

export class PolkadotClient {
  api?: ApiPromise;
  currentBatch: BlockHeader[] = [];
  batches: Batch[] = [];

  constructor() {
    ApiPromise.create()
      .then((api) => {
        this.api = api;
        return this.api.isReady;
      })
      .then(() => this.startListening())
      .catch((error) => {
        console.error("Failed to create Polkadot API:", error);
      });
  }

  startListening() {
    this.api?.rpc.chain.subscribeNewHeads((header) => {
      const blockHeader: BlockHeader = {
        number: header.number.toNumber?.() ?? header.number,
        hash: header.hash.toString(),
        parentHash: header.parentHash.toString(),
      };
      this.currentBatch.push(blockHeader);

      if (this.currentBatch.length === config.BATCH_SIZE) {
        const newBatch = new Batch(this.currentBatch);
        this.batches.push(newBatch);
        this.currentBatch = [];
      }
    });
  }

  // Function to query by block number
  queryByBlockNumber(blockNumber: number): BlockHeader | null {
    for (const batch of [...this.batches, { headers: this.currentBatch }]) {
      const header = batch.headers.find((h) => h.number === blockNumber);
      if (header) return header;
    }
    return null;
  }

  // Function to query by hash
  queryByHash(hash: string): BlockHeader | null {
    for (const batch of [...this.batches, { headers: this.currentBatch }]) {
      const header = batch.headers.find((h) => h.hash === hash);
      if (header) return header;
    }
    return null;
  }

  // Functions to generate proof
  generateProofByBlockNumber(blockNumber: number) {
    return this.generateProof(this.queryByBlockNumber(blockNumber));
  }

  generateProofByHash(hash: string) {
    return this.generateProof(this.queryByHash(hash));
  }

  private generateProof(header: BlockHeader | null): Buffer[] | null {
    try {
      if (header) {
        const batch = this.batches.find((b) => b.headers.includes(header));
        const proof = batch?.merkleTree.generateProof(
          Buffer.from(header.hash, "hex")
        );
        return proof ?? null;
      }
    } catch (error) {
      console.error("Failed to generate proof:", error);
    }
    return null;
  }

  // Function to verify a Merkle proof
  verifyProof(leaf: Buffer, proof: Buffer[]): boolean {
    for (const batch of this.batches) {
      const isValid = batch.merkleTree.verifyProof(
        proof,
        leaf,
        Buffer.from(batch.merkleTree.root, "hex")
      );

      if (isValid) {
        return true;
      }
    }

    return false;
  }
}
