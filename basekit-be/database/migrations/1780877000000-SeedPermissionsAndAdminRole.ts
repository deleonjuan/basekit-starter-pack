import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedPermissionsAndAdminRole1780877000000
  implements MigrationInterface
{
  name = "SeedPermissionsAndAdminRole1780877000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "permissions" (id, value, description)
      VALUES
        (gen_random_uuid(), 'tenants:read',             'Read tenants'),
        (gen_random_uuid(), 'tenants:write',            'Create and update tenants'),
        (gen_random_uuid(), 'tenants:delete',           'Delete tenants'),
        (gen_random_uuid(), 'roles:read',               'Read roles'),
        (gen_random_uuid(), 'roles:write',              'Create and update roles'),
        (gen_random_uuid(), 'roles:delete',             'Delete roles'),
        (gen_random_uuid(), 'permissions:read',         'Read permissions'),
        (gen_random_uuid(), 'permissions:write',        'Create and update permissions'),
        (gen_random_uuid(), 'permissions:delete',       'Delete permissions'),
        (gen_random_uuid(), 'users:read',               'Read users'),
        (gen_random_uuid(), 'users:write',              'Create and update users'),
        (gen_random_uuid(), 'users:delete',             'Delete users'),
        (gen_random_uuid(), 'users.roles:read',         'Read user role assignments'),
        (gen_random_uuid(), 'users.roles:write',        'Assign and remove roles from users'),
        (gen_random_uuid(), 'roles.permissions:read',   'Read role permission assignments'),
        (gen_random_uuid(), 'roles.permissions:write',  'Assign and remove permissions from roles'),
        (gen_random_uuid(), 'refresh_tokens:read',      'Read refresh tokens'),
        (gen_random_uuid(), 'refresh_tokens:delete',    'Revoke refresh tokens')
      ON CONFLICT (value) DO NOTHING
    `);

    await queryRunner.query(`
      INSERT INTO "roles" (id, name, description)
      VALUES (gen_random_uuid(), 'admin', 'Administrator with full access to all resources')
      ON CONFLICT (name) DO NOTHING
    `);

    await queryRunner.query(`
      INSERT INTO "role_permissions" (role_id, permission_id)
      SELECT r.id, p.id
      FROM "roles" r
      CROSS JOIN "permissions" p
      WHERE r.name = 'admin'
      ON CONFLICT DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "role_permissions"
      WHERE role_id = (SELECT id FROM "roles" WHERE name = 'admin')
    `);

    await queryRunner.query(`
      DELETE FROM "roles" WHERE name = 'admin'
    `);

    await queryRunner.query(`
      DELETE FROM "permissions"
      WHERE value IN (
        'tenants:read',
        'tenants:write',
        'tenants:delete',
        'roles:read',
        'roles:write',
        'roles:delete',
        'permissions:read',
        'permissions:write',
        'permissions:delete',
        'users:read',
        'users:write',
        'users:delete',
        'users.roles:read',
        'users.roles:write',
        'roles.permissions:read',
        'roles.permissions:write',
        'refresh_tokens:read',
        'refresh_tokens:delete'
      )
    `);
  }
}
