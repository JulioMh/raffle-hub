import { Connection } from '@metaplex/js';
import { SolanaService } from './SolanaService';

const connection = new Connection('mainnet-beta');

export { SolanaService } from './SolanaService';
export const solanaService: SolanaService = new SolanaService(connection);
