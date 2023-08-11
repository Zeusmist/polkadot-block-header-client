import { BlockHeader } from "./BlockHeader";
import { MerkleTreeModel } from "./MerkleTreeModel";

export class Batch {
  headers: BlockHeader[];
  merkleTree: MerkleTreeModel;

  constructor(headers: BlockHeader[]) {
    const sortedHeaders = headers.sort((a, b) => a.number - b.number);

    this.headers = sortedHeaders;
    const leaves = sortedHeaders.map((header) =>
      Buffer.from(header.hash, "hex")
    );
    this.merkleTree = new MerkleTreeModel(leaves);
  }
}
