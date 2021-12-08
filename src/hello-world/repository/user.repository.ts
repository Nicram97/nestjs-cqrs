import { User } from '../models/user.model';
import { user } from './fixtures/user';

export class UserRepository {
  async findByName(name: string): Promise<User> {
    return user;
  }

  async findAll(): Promise<User[]> {
    return [user];
  }
}
