import { Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { DataSource } from "typeorm";
import { TENANT_DATASOURCE } from "../tenant/tenant.provider";
import { Role } from "./entities/role.entity";
import { Permission } from "./entities/permission.entity";
import { CreateRoleInput } from "./dto/create-role.input";

@Injectable({ scope: Scope.REQUEST })
export class RoleService {
  constructor(@Inject(TENANT_DATASOURCE) private readonly ds: DataSource) {}

  private get roleRepo() {
    return this.ds.getRepository(Role);
  }

  private get permRepo() {
    return this.ds.getRepository(Permission);
  }

  findAll(): Promise<Role[]> {
    return this.roleRepo.find();
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepo.findOneBy({ id });
    if (!role) throw new NotFoundException(`Role ${id} not found`);
    return role;
  }

  async create(input: CreateRoleInput): Promise<Role> {
    const role = this.roleRepo.create(input);
    return this.roleRepo.save(role);
  }

  async delete(id: string): Promise<boolean> {
    await this.findOne(id);
    await this.roleRepo.delete(id);
    return true;
  }

  async assignPermission(roleId: string, permissionId: string): Promise<Role> {
    const role = await this.roleRepo.findOne({
      where: { id: roleId },
      relations: { permissions: true },
    });
    if (!role) throw new NotFoundException(`Role ${roleId} not found`);

    const perm = await this.permRepo.findOneBy({ id: permissionId });
    if (!perm)
      throw new NotFoundException(`Permission ${permissionId} not found`);

    role.permissions = [...(role.permissions ?? []), perm];
    return this.roleRepo.save(role);
  }

  async revokePermission(roleId: string, permissionId: string): Promise<Role> {
    const role = await this.roleRepo.findOne({
      where: { id: roleId },
      relations: { permissions: true },
    });
    if (!role) throw new NotFoundException(`Role ${roleId} not found`);

    role.permissions = (role.permissions ?? []).filter(
      (p) => p.id !== permissionId,
    );
    return this.roleRepo.save(role);
  }

  findAllPermissions(): Promise<Permission[]> {
    return this.permRepo.find();
  }

  async createPermission(
    value: string,
    description?: string,
  ): Promise<Permission> {
    const perm = this.permRepo.create({ value, description });
    return this.permRepo.save(perm);
  }
}
