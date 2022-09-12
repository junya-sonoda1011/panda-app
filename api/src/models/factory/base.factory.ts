import { Connection } from 'typeorm';

export class BaseFactory {
  static async getValue(value = '1') {
    return {};
  }

  /**
   * Truncate
   */
  static async truncate<T>(connection: Connection, model: new () => T) {
    return connection.createQueryBuilder().delete().from(model).execute();
  }

  static async create<T>(
    connection: Connection,
    model: new () => T,
    overrideValue = {},
  ) {
    const repository = connection.getRepository(model);
    const data4Save: any = Object.assign(new model(), {
      ...(await this.getValue),
      ...overrideValue,
    });
    return repository.save(data4Save);
  }

  static async createMany<T>(
    connection: Connection,
    model: new () => T,
    overrideData = [],
  ) {
    const repository = connection.getRepository(model);
    const data4Save = [];
    for (const [index, overrideValue] of overrideData.entries()) {
      const value4Save = Object.assign(new model(), {
        ...(await this.getValue(String(index + 1))),
        ...overrideValue,
      });

      data4Save.push(value4Save);
    }
    return repository.save(data4Save);
  }
}
