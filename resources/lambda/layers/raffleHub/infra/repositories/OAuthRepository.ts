import { RedisClientType } from 'redis';

interface Verification {
  userUuid: string;
  state: string;
  codeChallenge?: string;
}

export class OAuthRepository {
  private client: RedisClientType;

  constructor(client: RedisClientType) {
    this.client = client;
  }

  async saveVerification({ userUuid, state, codeChallenge }: Verification): Promise<void> {
    await this.client.set(state, JSON.stringify({ userUuid, codeChallenge, state }));
  }

  async getVerification(state: string): Promise<Verification | undefined> {
    const item = await this.client.get(state);

    return item ? (JSON.parse(item) as Verification) : undefined;
  }
}
