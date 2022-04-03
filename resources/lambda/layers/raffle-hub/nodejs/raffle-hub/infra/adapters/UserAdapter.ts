import { User } from '../../domain/user/User';

interface UserResponse {
  todo: string;
}

export class UserAdapter {
  static toResponse(user: User): UserResponse {
    return {
      todo: 'aa',
    };
  }
}
