import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Base } from './base.abstract-entity';
import { RecordedSnack } from './recorded_snack.entity';
import { User } from './user.entity';

/**
 * 食事記録
 */
@Entity('meal_records')
export class MealRecord extends Base {
  /** 食事記録ID */
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '食事記録ID',
  })
  id: string;

  /** ユーザーID */
  @Column({
    type: 'int',
    name: 'user_id',
    unique: true,
    comment: 'ユーザーID',
  })
  userId: string;

  /** 食事記録エネルギー量 */
  @Column({
    type: 'int',
    name: 'total_intake_energy',
    comment: '食事記録エネルギー量',
  })
  totalIntakeEnergy: number;

  /** ユーザーリレーション */
  @ManyToOne(() => User, (user) => user.mealRecords)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: User;

  /** 被記録菓子リレーション */
  @OneToMany(() => RecordedSnack, (recordedSnack) => recordedSnack.mealRecord)
  recordedSnacks: RecordedSnack[];
}
