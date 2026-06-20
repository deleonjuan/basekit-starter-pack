import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Tenant } from "./tenant.entity";
import { evictTenantConnection } from "./tenant.provider";
import { PaginationInput } from "../common/dto/pagination.input";
import { IPaginatedResult } from "../common/types/paginated-result.type";
import { findMany } from "../common/utils/find-many.util";

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  findAll(pagination: PaginationInput = {}): Promise<IPaginatedResult<Tenant>> {
    return findMany(this.tenantRepository, pagination);
  }

  findById(id: string): Promise<Tenant | null> {
    return this.tenantRepository.findOneBy({ id, isActive: true });
  }

  findBySlug(slug: string): Promise<Tenant | null> {
    return this.tenantRepository.findOneBy({ slug, isActive: true });
  }

  async deactivate(id: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOneBy({ id });
    if (!tenant) throw new NotFoundException(`Tenant ${id} not found`);

    tenant.isActive = false;
    const saved = await this.tenantRepository.save(tenant);

    evictTenantConnection(tenant.slug);

    return saved;
  }
}
