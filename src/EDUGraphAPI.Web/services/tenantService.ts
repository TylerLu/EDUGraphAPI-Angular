﻿import * as Sequelize from 'sequelize';
import * as Promise from "bluebird";
import { DbContext, OrganizationInstance } from '../data/dbContext';
import { UserService } from '../services/userService';

export class TenantService {
    private dbContext = new DbContext();
    private userService = new UserService();

    public getTenant(tenantId: string): Promise<OrganizationInstance> {
        return this.dbContext.Organization
            .find({ where: { tenantId: tenantId } });
    }
    public updateTenant(tenantId: string, adminConsented: boolean): Promise<OrganizationInstance> {
        return this.getTenant(tenantId)
            .then((org: OrganizationInstance) => {
                org.isAdminConsented = adminConsented;
                return org.save();
            })
    }
    public unlinkTenantAllAccounts(tenant: OrganizationInstance): Promise<any> {
        return tenant.getUsers()
            .then((users) => {
                if (users != null && users.length > 0) {
                    let promises = new Array<Promise<any>>();
                    users.forEach(user => { promises.push(this.userService.unlinkUser(user.id)) })
                    return Promise.all(promises)
                }
            })
            .then((ret) => {
                return tenant.removeUsers();
            })
    }
}