import { User } from '../../user/User';

export interface Requirement {
  meetsRequirements(user: User): boolean;
}
