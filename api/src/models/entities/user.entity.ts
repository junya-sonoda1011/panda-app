import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base.abstract-entity';
import { MealRecord } from './meal_record.entity';

/**
 * ユーザー
 */
@Entity('users')
export class User extends Base {
  /** ユーザーID */
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: 'ユーザーID',
  })
  id: string;

  /** ユーザー名 */
  @Column({
    type: 'varchar',
    name: 'name',
    length: 255,
    unique: true,
    comment: 'ユーザー名',
  })
  name: string;

  /** 仕事 */
  @Column({
    type: 'varchar',
    name: 'work',
    length: 255,
    comment: '仕事',
  })
  work: string;

  /** 趣味 */
  @Column({
    type: 'varchar',
    name: 'hobby',
    length: 255,
    comment: '趣味',
  })
  hobby: string;

  /** 食事記録リレーション */
  @OneToMany(() => MealRecord, (mealRecord) => mealRecord.user)
  mealRecords: MealRecord[];
}
