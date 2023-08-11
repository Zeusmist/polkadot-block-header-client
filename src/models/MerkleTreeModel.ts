import { MerkleTree } from "merkletreejs";
import * as crypto from "crypto";

export class MerkleTreeModel {
  tree: MerkleTree;
  root: string;

  constructor(leaves: Buffer[]) {
    const hashFunction = (x: Buffer) =>
      crypto.createHash("sha256").update(x).digest();

    this.tree = new MerkleTree(leaves, hashFunction);
    this.root = this.tree.getRoot().toString("hex");
  }

  // Function to generate proof for a specific leaf
  generateProof(leaf: Buffer) {
    return this.tree.getProof(leaf);
  }
}
