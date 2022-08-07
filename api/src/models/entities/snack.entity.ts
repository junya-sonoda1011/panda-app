import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base.abstract-entity';
import { RecordedSnack } from './recorded_snack.entity';

/**
 * 被記録菓子
 */
@Entity('snacks')
export class Snack extends Base {
  /** 被記録菓子ID */
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '菓子ID',
  })
  id: string;

  /** 菓子名称 */
  @Column({
    type: 'varchar',
    name: 'name',
    length: 255,
    comment: '菓子名称',
  })
  name: string;

  /** 基準エネルギー量 */
  @Column({
    type: 'int',
    name: 'standard_energy',
    comment: '基準エネルギー量',
  })
  standardEnergy: number;

  /** 基準重量 */
  @Column({
    type: 'int',
    name: 'standard_weight',
    comment: '基準重量',
  })
  standardWeight: number;

  /** 菓子表示名称 */
  @Column({
    type: 'varchar',
    name: 'display_name',
    length: 255,
    nullable: true,
    comment: '菓子表示名称',
  })
  displayName: string;

  /** 単位重量 */
  @Column({
    type: 'int',
    name: 'unit_weight',
    nullable: true,
    comment: '単位重量',
  })
  unitWeight: number;

  /** 単位基準重量比 */
  @Column({
    type: 'int',
    name: 'unit_and_standard_weight_ratio',
    nullable: true,
    comment: '単位基準重量比',
  })
  unitAndStandardWeightRatio: number;

  /** 単位入力フラグ */
  @Column({
    type: 'boolean',
    name: 'is_unit_entered',
    default: false,
    comment: '単位入力フラグ',
  })
  isUnitEntered: boolean;

  /** 被記録菓子リレーション */
  @OneToMany(() => RecordedSnack, (recordedSnack) => recordedSnack.snack)
  recordedSnacks: RecordedSnack[];
}
