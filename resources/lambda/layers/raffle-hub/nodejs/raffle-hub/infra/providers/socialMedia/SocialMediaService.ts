import { OAuth } from '../../../domain/user/Credentials';
import { SocialMediaProfile } from '../../../domain/user/Profile';

export interface SocialMediaService {
  getUserData(oauth: OAuth): Promise<SocialMediaProfile>;
}
