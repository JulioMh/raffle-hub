/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Connection, programs } from '@metaplex/js';

const {
  metadata: { Metadata },
} = programs;

export class SolanaService {
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  async getWalletNFTs(address: string): Promise<any> {
    return Metadata.findDataByOwner(this.connection, address);
  }
}
