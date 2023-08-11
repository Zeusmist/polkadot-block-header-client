import { BlockHeader } from "./BlockHeader";
import { MerkleTreeModel } from "./MerkleTreeModel";

export class Batch {
  headers: BlockHeader[];
  merkleTree: MerkleTreeModel;

  constructor(headers: BlockHeader[]) {
    this.headers = headers;
    const leaves = headers.map((header) => Buffer.from(header.hash, "hex"));
    this.merkleTree = new MerkleTreeModel(leaves);
  }
}
