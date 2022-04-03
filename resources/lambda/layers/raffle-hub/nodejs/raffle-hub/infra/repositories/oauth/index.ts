import { createClient } from 'redis';
import { OAuthRepository } from './OAuthRepository';

const client = createClient();

export const oauthRepository = new OAuthRepository(client);
