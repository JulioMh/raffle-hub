import { OAuth } from '../../../domain/user/Credentials';
import { SocialMedia } from '../../../domain/user/SocialMedia';
import { User } from '../../../domain/user/User';

export class UserRepository {
  private dbClient: any;

  constructor(dbClient: any) {
    this.dbClient = dbClient;
  }

  getUser(uuid: string): Promise<User> {
    throw new Error('Method not implemented');
  }


  update(user: User): Promise<User> {
    throw new Error('Method not implemented');
  }
}
