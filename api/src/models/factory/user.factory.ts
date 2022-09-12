import { BaseFactory } from './base.factory';

export class UserFactory extends BaseFactory {
  static async getValue(value = '1') {
    return {
      id: value,
      name: 'name' + value,
      work: 'work' + value,
      hobby: 'hobby' + value,
      password: 'password' + value,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
