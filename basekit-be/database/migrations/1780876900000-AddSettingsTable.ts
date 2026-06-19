import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSettingsTable1780876900000 implements MigrationInterface {
  name = "AddSettingsTable1780876900000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "settings" (
        "id"         uuid                     NOT NULL DEFAULT gen_random_uuid(),
        "key"        character varying        NOT NULL,
        "value"      jsonb                    NOT NULL,
        "scope"      character varying(10)    NOT NULL,
        "user_id"    uuid,
        "created_at" TIMESTAMPTZ              NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ              NOT NULL DEFAULT NOW(),
        CONSTRAINT "PK_settings" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_settings_scope" CHECK (scope IN ('global', 'personal')),
        CONSTRAINT "CHK_settings_scope_user" CHECK (
          (scope = 'global'   AND user_id IS NULL) OR
          (scope = 'personal' AND user_id IS NOT NULL)
        )
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "settings"
        ADD CONSTRAINT "FK_settings_user_id"
        FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UX_settings_global_key"
        ON "settings" ("key") WHERE scope = 'global'
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UX_settings_personal_user_key"
        ON "settings" ("key", "user_id") WHERE scope = 'personal'
    `);

    // Seed permissions for global settings management
    await queryRunner.query(`
      INSERT INTO "permissions" (id, value, description)
      VALUES
        (gen_random_uuid(), 'settings.global:read',  'Read global application settings'),
        (gen_random_uuid(), 'settings.global:write', 'Write global application settings')
      ON CONFLICT (value) DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "UX_settings_personal_user_key"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "UX_settings_global_key"`);
    await queryRunner.query(`DROP TABLE "settings"`);
    await queryRunner.query(`
      DELETE FROM "permissions"
      WHERE value IN ('settings.global:read', 'settings.global:write')
    `);
  }
}
