import * as Sequelize from 'sequelize';
import * as Storage from '../data/dbContext';
import * as Promise from "bluebird";

var dbContext = new Storage.DbContext();

//create ogranzation
export function createOrUpdateOrganization(tenantId: string, tenantName: string, adminConsented: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
        dbContext.sequelize.transaction((transaction: Sequelize.Transaction) => {
            return dbContext.Organization.findOne({
                    transaction: transaction,
                    where: { tenantId: tenantId }
            }).then((organization) => {
                if (organization == null) {
                    let item: Storage.OrganizationAttributes = { name: tenantName, tenantId: tenantId, isAdminConsented: adminConsented, created: new Date() };
                    return dbContext.Organization
                        .create(item, { transaction: transaction })
                } else {
                    organization.name = tenantName;
                    organization.tenantId = tenantId;
                    organization.isAdminConsented = adminConsented;
                    return organization.save()
                }
            })
        }).then((organization) => {
            resolve(organization)
            }).catch((err: any) => {
                reject(err);
            })
    });
}