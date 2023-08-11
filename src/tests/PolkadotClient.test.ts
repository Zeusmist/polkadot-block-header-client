import { PolkadotClient } from "../PolkadotClient";
import { ApiPromise } from "@polkadot/api";

// Sample data for mocking
const MOCK_BLOCK_HEADER = {
  number: 123,
  hash: "0xabc",
  parentHash: "0xdef",
};

jest.mock("@polkadot/api", () => {
  return {
    ApiPromise: {
      create: jest.fn().mockResolvedValue({
        isReady: Promise.resolve(true),
        rpc: {
          chain: {
            subscribeNewHeads: jest.fn((callback: Function) => {
              callback(MOCK_BLOCK_HEADER);
            }),
          },
        },
      }),
    },
  };
});

describe("PolkadotClient", () => {
  let polkadotClient: PolkadotClient;

  beforeEach(() => {
    polkadotClient = new PolkadotClient();
  });

  test("should subscribe to new heads and populate currentBatch", (done) => {
    setTimeout(() => {
      expect(polkadotClient.currentBatch).toHaveLength(1);
      expect(polkadotClient.currentBatch[0].number).toBe(
        MOCK_BLOCK_HEADER.number
      );
      done();
    }, 100);
  });

  test("should query by block number", () => {
    polkadotClient.currentBatch.push(MOCK_BLOCK_HEADER);
    const header = polkadotClient.queryByBlockNumber(MOCK_BLOCK_HEADER.number);
    expect(header).toEqual(MOCK_BLOCK_HEADER);
  });

  test("should query by hash", () => {
    polkadotClient.currentBatch.push(MOCK_BLOCK_HEADER);
    const header = polkadotClient.queryByHash(MOCK_BLOCK_HEADER.hash);
    expect(header).toEqual(MOCK_BLOCK_HEADER);
  });
});
