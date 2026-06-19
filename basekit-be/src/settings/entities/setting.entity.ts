import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("settings")
export class Setting {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  key!: string;

  @Column({ type: "jsonb" })
  value!: unknown;

  @Column({ type: "varchar", length: 10 })
  scope!: "global" | "personal";

  @Column({ name: "user_id", type: "uuid", nullable: true })
  userId!: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
