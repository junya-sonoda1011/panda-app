import { CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

/**
 * 共通カラム
 */
@Entity()
export abstract class Base {
  /**
   * 作成日時
   */
  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    comment: '作成日時',
  })
  createdAt: Date;

  /**
   * 更新日時
   */
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
    comment: '更新日時',
  })
  updatedAt: Date;
}
