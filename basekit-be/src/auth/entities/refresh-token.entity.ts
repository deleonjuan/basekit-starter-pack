import { CreateDateColumn, Column, Entity, PrimaryColumn } from "typeorm";

@Entity("refresh_tokens")
export class RefreshToken {
  @PrimaryColumn({ type: "uuid" })
  id!: string;

  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @Column({ name: "token_hash" })
  tokenHash!: string;

  @Column({ name: "expires_at", type: "timestamptz" })
  expiresAt!: Date;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
