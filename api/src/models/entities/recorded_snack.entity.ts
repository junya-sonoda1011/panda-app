import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Base } from './base.abstract-entity';
import { MealRecord } from './meal_record.entity';
import { Snack } from './snack.entity';

/**
 * 被記録菓子
 */
@Entity('recorded_snacks')
export class RecordedSnack extends Base {
  /** 被記録菓子ID */
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '被記録菓子ID',
  })
  id: string;

  /** 食事記録ID */
  @Column({
    type: 'int',
    name: 'meal_record_id',
    unique: true,
    comment: '食事記録ID',
  })
  mealRecordId: string;

  /** 菓子ID */
  @Column({
    type: 'int',
    name: 'snack_id',
    unique: true,
    comment: '菓子ID',
  })
  snackId: string;

  /** 単位摂取量 */
  @Column({
    type: 'int',
    name: 'unit_intake_weight',
    comment: '単位摂取量',
  })
  unitIntakeWeight: number;

  /** 食事記録エネルギー量 */
  @Column({
    type: 'int',
    name: 'unit_intake_energy',
    comment: '単位摂取エネルギー量',
  })
  unitIntakeEnergy: number;

  /** 食事記録リレーション */
  @ManyToOne(() => MealRecord, (mealRecord) => mealRecord.recordedSnacks)
  @JoinColumn({
    name: 'meal_record_id',
    referencedColumnName: 'id',
  })
  mealRecord: MealRecord;

  /** 菓子リレーション */
  @ManyToOne(() => Snack, (snack) => snack.recordedSnacks)
  @JoinColumn({
    name: 'snack_id',
    referencedColumnName: 'id',
  })
  snack: Snack;
}
