import { Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { DataSource } from "typeorm";
import { TENANT_DATASOURCE } from "../tenant/tenant.provider";
import { User } from "./entities/user.entity";
import { Role } from "../role/entities/role.entity";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { PaginationInput } from "../common/dto/pagination.input";
import { IPaginatedResult } from "../common/types/paginated-result.type";
import { findMany } from "../common/utils/find-many.util";

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(@Inject(TENANT_DATASOURCE) private readonly ds: DataSource) {}

  private get repo() {
    return this.ds.getRepository(User);
  }

  findAll(pagination: PaginationInput = {}): Promise<IPaginatedResult<User>> {
    return findMany(this.repo, pagination);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.repo.findOneBy({ id });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  findByUsername(username: string): Promise<User | null> {
    return this.repo.findOneBy({ username });
  }

  findWithPermissions(id: string): Promise<User | null> {
    return this.repo.findOne({
      where: { id },
      relations: { roles: { permissions: true } },
    });
  }

  async create(input: CreateUserInput): Promise<User> {
    const hashed = await bcrypt.hash(input.password, 12);
    const user = this.repo.create({ ...input, password: hashed });
    return this.repo.save(user);
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const user = await this.findOne(id);
    if (input.password) {
      input.password = await bcrypt.hash(input.password, 12);
    }
    Object.assign(user, input);
    return this.repo.save(user);
  }

  async delete(id: string): Promise<boolean> {
    await this.findOne(id);
    await this.repo.delete(id);
    return true;
  }

  async assignRole(userId: string, roleId: string): Promise<User> {
    const user = await this.repo.findOne({
      where: { id: userId },
      relations: { roles: true },
    });
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    const role = await this.ds.getRepository(Role).findOneBy({ id: roleId });
    if (!role) throw new NotFoundException(`Role ${roleId} not found`);

    user.roles = [...(user.roles ?? []), role];
    return this.repo.save(user);
  }

  async revokeRole(userId: string, roleId: string): Promise<User> {
    const user = await this.repo.findOne({
      where: { id: userId },
      relations: { roles: true },
    });
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    user.roles = (user.roles ?? []).filter((r) => r.id !== roleId);
    return this.repo.save(user);
  }
}
