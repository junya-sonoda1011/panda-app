import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
  })
  id: string;

  @Column({
    type: 'varchar',
    name: 'name',
    length: 255,
  })
  name: string;

  @Column({
    type: 'varchar',
    name: 'work',
    length: 255,
  })
  work: string;

  @Column({
    type: 'varchar',
    name: 'hobby',
    length: 255,
  })
  hobby: string;

  @CreateDateColumn({
    type: 'datetime',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    name: 'updated_at',
  })
  updatedAt: Date;
}
