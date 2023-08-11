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

  generateProof(leaf: Buffer) {
    const proof = this.tree.getProof(leaf);
    return proof.map((p) => p.data);
  }

  verifyProof(proof: Buffer[], leaf: Buffer, expectedRoot: Buffer) {
    return this.tree.verify(proof, leaf, expectedRoot);
  }
}
