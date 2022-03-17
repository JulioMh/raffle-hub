import { User } from '../User';

export interface Requirement {
  meetsRequirements(user: User): boolean;
}
