import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1780876800000 implements MigrationInterface {
  name = "InitialSchema1780876800000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "tenants" (
        "id"            uuid                NOT NULL DEFAULT gen_random_uuid(),
        "slug"          character varying   NOT NULL,
        "name"          character varying   NOT NULL,
        "configuration" jsonb,
        "is_active"     boolean             NOT NULL DEFAULT true,
        "created_at"    TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
        CONSTRAINT "UQ_tenants_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_tenants"      PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "roles" (
        "id"          uuid              NOT NULL DEFAULT gen_random_uuid(),
        "name"        character varying NOT NULL,
        "description" character varying,
        "is_active"   boolean           NOT NULL DEFAULT true,
        "created_at"  TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
        "updated_at"  TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
        CONSTRAINT "UQ_roles_name" UNIQUE ("name"),
        CONSTRAINT "PK_roles"      PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "permissions" (
        "id"          uuid              NOT NULL DEFAULT gen_random_uuid(),
        "value"       character varying NOT NULL,
        "description" character varying,
        "is_active"   boolean           NOT NULL DEFAULT true,
        "created_at"  TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
        "updated_at"  TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
        CONSTRAINT "UQ_permissions_value" UNIQUE ("value"),
        CONSTRAINT "PK_permissions"       PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id"             uuid              NOT NULL DEFAULT gen_random_uuid(),
        "username"       character varying NOT NULL,
        "password"       character varying NOT NULL,
        "tenant_id"      uuid,
        "is_super_admin" boolean           NOT NULL DEFAULT false,
        "is_active"      boolean           NOT NULL DEFAULT true,
        "created_at"     TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
        "updated_at"     TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
        CONSTRAINT "UQ_users_username" UNIQUE ("username"),
        CONSTRAINT "PK_users"          PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "user_roles" (
        "user_id" uuid NOT NULL,
        "role_id" uuid NOT NULL,
        CONSTRAINT "PK_user_roles"         PRIMARY KEY ("user_id", "role_id"),
        CONSTRAINT "FK_user_roles_user_id" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_user_roles_role_id" FOREIGN KEY ("role_id")
          REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "role_permissions" (
        "role_id"       uuid NOT NULL,
        "permission_id" uuid NOT NULL,
        CONSTRAINT "PK_role_permissions"              PRIMARY KEY ("role_id", "permission_id"),
        CONSTRAINT "FK_role_permissions_role_id"      FOREIGN KEY ("role_id")
          REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_role_permissions_permission_id" FOREIGN KEY ("permission_id")
          REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "refresh_tokens" (
        "id"         uuid              NOT NULL,
        "user_id"    uuid              NOT NULL,
        "token_hash" character varying NOT NULL,
        "expires_at" TIMESTAMPTZ       NOT NULL,
        "created_at" TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
        CONSTRAINT "PK_refresh_tokens" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    await queryRunner.query(`DROP TABLE "role_permissions"`);
    await queryRunner.query(`DROP TABLE "user_roles"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "permissions"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "tenants"`);
  }
}
