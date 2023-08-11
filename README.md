# Polkadot Block Header Light Client

This project implements a Polkadot block header light client, which listens to new Polkadot headers and stores sequential batches of them inside a Merkle tree. It fulfills the following attributes:

- Decides on a header batch size and creates and writes to Merkle tree once the size limit has been reached.
- Stores the Merkle trees and corresponding roots in-memory.
- Allows each header to be queryable by block number or hash.
- Implements functions that generate the Merkle inclusion proof for each stored header.
- Implements a function for verifying the generated proofs.

## Prerequisites

Make sure you have installed all of the following prerequisites on your development machine:

- Node.js
- Typescript
- @polkadot/api package

## Getting Started

Clone the repository and install the dependencies:

```bash
git clone https://github.com/Zeusmist/polkadot-block-header-client.git
cd polkadot-block-header-client
npm install
```

## Running the client

```bash
npm start
```

## Querying Headers

You can query a block header by its number or hash using the following methods:

- `queryByBlockNumber(blockNumber: number): BlockHeader | null`
- `queryByHash(hash: string): BlockHeader | null`

## Generating and Verifying Proofs

You can generate a Merkle proof for a specific header by block number or hash and verify it using the following methods:

- `generateProofByBlockNumber(blockNumber: number): Buffer[] | null`
- `generateProofByHash(hash: string): Buffer[] | null`
- `verifyProof(leaf: Buffer, proof: Buffer[]): boolean`

## Tests

To run the test suite, execute:

```bash
npm test
```

## Code Structure

- `src\models\Batch.ts`: Contains the Batch class to manage a batch of headers and the corresponding Merkle tree.
- `src\models\BlockHeader.ts`: Defines the BlockHeader interface.
- `src\models\MerkleTreeModel.ts`: Wraps the Merkle tree functionality.
- `src\PolkadotClient.ts`: Implements the Polkadot client, including listening to new headers, batching them, and query functionality.
- `src\tests\PolkadotClient.test.ts`: Contains the tests for the PolkadotClient class.
