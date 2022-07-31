import { User } from 'src/models/entities/user.entity';

export class UserResponse {
  name: string;
  work: string;
  hobby: string;

  constructor(user: User) {
    this.name = user.name;
    this.work = user.work;
    this.hobby = user.hobby;
  }
}
