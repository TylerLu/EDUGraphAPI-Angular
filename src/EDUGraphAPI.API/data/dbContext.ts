import * as fs from 'fs';
import * as path from 'path';
import * as Sequelize from 'sequelize';
import * as Promise from "bluebird";

// User
export interface UserAttributes {
    id?: string;
    firstName?: string;
    lastName?: string;
    o365UserId?: string;
    o365Email?: string;
    email?: string;
    passwordHash?: string;
    salt?: string;
    favoriteColor?: string;
}
export interface UserInstance extends Sequelize.Instance<UserAttributes>, UserAttributes {
    //getOrganization: Sequelize.BelongsToGetAssociationMixin<OrganizationInstance>;
    //setOrganization: Sequelize.BelongsToSetAssociationMixin<OrganizationInstance, number>;
    //createOrganization: Sequelize.BelongsToCreateAssociationMixin<OrganizationInstance>;

    //getUserRoles: Sequelize.HasManyGetAssociationsMixin<UserRoleAttributes>;
    //setUserRoles: Sequelize.HasManySetAssociationsMixin<UserRoleAttributes, number>;
    //addUserRoles: Sequelize.HasManyAddAssociationsMixin<UserRoleAttributes, number>;
    //addUserRole: Sequelize.HasManyAddAssociationMixin<UserRoleAttributes, number>;
    //createUserRole: Sequelize.HasManyCreateAssociationMixin<UserRoleAttributes>;
    //removeUserRole: Sequelize.HasManyRemoveAssociationMixin<UserRoleAttributes, number>;
    //removeUserRoles: Sequelize.HasManyRemoveAssociationsMixin<UserRoleAttributes, number>;
    //hasUserRole: Sequelize.HasManyHasAssociationMixin<UserRoleAttributes, number>;
    //hasUserRoles: Sequelize.HasManyHasAssociationsMixin<UserRoleAttributes, number>;
    //countUserRoles: Sequelize.HasManyCountAssociationsMixin;
}
export interface UserModel extends Sequelize.Model<UserInstance, UserAttributes> { }

// Organization
export interface OrganizationAttributes {
    name?: string;
    tenantId?: string;
    isAdminConsented: boolean;
    created: Date;
}
export interface OrganizationInstance extends Sequelize.Instance<OrganizationAttributes>, OrganizationAttributes {
}
export interface OrganizationModel extends Sequelize.Model<OrganizationInstance, OrganizationAttributes> { }


// User Roles
export interface UserRoleAttributes {
    name?: string;
}

export interface UserRoleInstance extends Sequelize.Instance<UserRoleAttributes>, UserRoleAttributes {
}
export interface UserRoleModel extends Sequelize.Model<UserRoleInstance, UserRoleAttributes > { }

 //User Claims
export interface UserClaimAttributes {
    claimType?: string;
    claimValue?: string;
}

export interface UserClaimInstance extends Sequelize.Instance<UserClaimAttributes>, UserClaimAttributes {
}
export interface UserClaimModel extends Sequelize.Model<UserClaimInstance, UserClaimAttributes> { }

//ClassroomSeatingArrangements
export interface ClassroomSeatingArrangementAttributes {
    position: number;
    o365UserId?: string;
    classId?: string;
}

export interface ClassroomSeatingArrangementInstance extends Sequelize.Instance<ClassroomSeatingArrangementAttributes>, ClassroomSeatingArrangementAttributes {
}
export interface ClassroomSeatingArrangementModel extends Sequelize.Model<ClassroomSeatingArrangementInstance, ClassroomSeatingArrangementAttributes> { }

// DbContext
export class DbContext {
    public sequelize: Sequelize.Sequelize;
    public User: UserModel;
    public Organization: OrganizationModel;
    public UserRole: UserRoleModel;
    public UserClaim: UserClaimModel;
    public ClassroomSeatingArrangement: ClassroomSeatingArrangementModel;

    constructor() {
        this.init();
    }

    public sync(options?: Sequelize.SyncOptions): Promise<any> {
        return this.sequelize.sync(options);
    }

    private init() {
        this.sequelize = new Sequelize('EDUGraphAPI2DEV', 'EduGraphAPI', 'EDRF8Uu6PVG6UVi', {
            dialect: 'mssql',
            host: 'edugraphapi2dev.database.windows.net',
            dialectOptions: {
                encrypt: true
            }
        });

        this.User = this.sequelize.define<UserInstance, UserAttributes>('User',
            {
                id: {
                    "type": Sequelize.UUID,
                    "allowNull": false,
                    "primaryKey": true
                },
                firstName: Sequelize.STRING,
                lastName: Sequelize.STRING,
                o365UserId: Sequelize.STRING,
                o365Email: Sequelize.STRING,
                email: Sequelize.STRING,
                passwordHash: Sequelize.STRING,
                salt: Sequelize.STRING,
                favoriteColor: Sequelize.STRING
            },
            {
                timestamps: false,
                tableName: "Users"
            });
        this.Organization = this.sequelize.define<OrganizationInstance, OrganizationAttributes>('Organization',
            {
                name: Sequelize.STRING,
                tenantId: Sequelize.STRING,
                isAdminConsented: { type: Sequelize.BOOLEAN, allowNull: false },
                created: { type: Sequelize.DATE, allowNull: false }
            },
            {
                timestamps: false,
                tableName: "Organizations"
            });
        this.User.belongsTo(this.Organization);
        // this.Organization.hasMany(this.User);

        this.UserRole = this.sequelize.define<UserRoleInstance, UserRoleAttributes>('UserRole',
            {
                name: { type: Sequelize.STRING, allowNull: false }
            },
            {
                timestamps: false,
                tableName: "UserRoles"
            });
        this.User.hasMany(this.UserRole);

        this.UserClaim = this.sequelize.define<UserClaimInstance, UserClaimAttributes>('UserClaim',
            {
                claimType: Sequelize.STRING,
                claimValue: Sequelize.STRING
            },
            {
                timestamps: false,
                tableName: "UserClaims"
            });
        this.UserClaim.belongsTo(this.User);

        this.ClassroomSeatingArrangement = this.sequelize.define<ClassroomSeatingArrangementInstance, ClassroomSeatingArrangementAttributes>('ClassroomSeatingArrangement',
            {
                position: { type: Sequelize.INTEGER, allowNull: false },
                o365UserId: Sequelize.STRING,
                classId: Sequelize.STRING
            },
            {
                timestamps: false,
                tableName: "ClassroomSeatingArrangements"
            });
        
    }
}