import { User } from '../User';
import { Requirement } from './Requirement';

export class HolderRequirement implements Requirement {
  readonly updateAuthority: string;

  constructor(updateAuthority: string) {
    this.updateAuthority = updateAuthority;
  }

  meetsRequirements(user: User): boolean {
    return !!user.collections.find(
      (collection) => collection.updateAuthority === this.updateAuthority
    );
  }
}
