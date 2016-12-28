import express = require('express');
import * as Sequelize from 'sequelize';
import { DbContext, UserInstance } from '../data/dbContext';
import * as uuid from "node-uuid";
import * as Promise from "bluebird";
import * as Models from '../data/models';
import * as bcrypt from 'bcryptjs';

import organizationService = require('../services/organizationService');

export class UserService {

    private dbContext = new DbContext();

    public creatUser(email: string, password: string, favoriteColor: string): Promise<UserInstance> {
        return new Promise<any>((resolve, reject) => {
            this.dbContext.User
                .findOne({ where: { email: email } })
                .then(user => {
                    if (user == null) {
                        let passwordSalt = bcrypt.genSaltSync();
                        let passwordHash = bcrypt.hashSync(password, passwordSalt);
                        this.dbContext.User.create(
                            {
                                id: uuid.v4(),
                                email: email,
                                passwordHash: passwordHash,
                                salt: passwordSalt,
                                favoriteColor: favoriteColor
                            })
                            .then(resolve)
                            .catch(reject);
                    }
                    else
                        reject(`Email ${email} is used by others`);

                })
                .catch(reject);
        });
    }

    public validUser(email: string, password: string): Promise<boolean> {
        let isValid: boolean;
        return this.dbContext.User
            .findOne({ where: { email: email } })
            .then(user => isValid = user != null && bcrypt.hashSync(password, user.salt) == user.passwordHash)
            .thenReturn(isValid);
    }

    public getUserById(userId: string): Promise<UserInstance> {
        return this.dbContext.User.findById(userId);
    }

    public getUserModelById(userId: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.dbContext.User.findById(userId)
                .then(user => {
                    var result = {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        o365UserId: user.o365UserId,
                        o365Email: user.o365Email,
                        favoriteColor: user.favoriteColor,
                        organization: null,
                        roles: []
                    }
                    var p1 = user.getOrganization()
                        .then(organization => result.organization = {
                            tenantId: organization.tenantId,
                            name: organization.name,
                            isAdminConsented: organization.isAdminConsented
                        })
                        .catch(reject);
                    var p2 = user.getUserRoles()
                        .then(userRoles => userRoles.forEach(i => result.roles.push(i.name)))
                        .catch(reject);
                    Promise.all([p1, p2])
                        .then(() => resolve(result))
                        .catch(reject);
                });
        });
    }

    public getLinkedUsers(): Promise<UserInstance[]> {
        return this.dbContext.User.findAll({
            where: {
                o365UserId: { $notIn: [null, ''] },
                o365Email: { $notIn: [null, ''] }
            }
        });
    }

    public updateUser(user: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.getUserById(user.id).then(u => {
                let promises = new Array<Promise<any>>();

                // update basic info
                if (user.firstName != undefined) u.firstName = user.firstName;
                if (user.lastName != undefined) u.lastName = user.lastName;
                if (user.o365UserId != undefined) u.o365UserId = user.o365UserId;
                if (user.o365Email != undefined) u.o365Email = user.o365Email
                if (user.favoriteColor != undefined) u.favoriteColor = user.favoriteColor;                
                promises.push(u.save().catch(reject));

                // update or create organization
                if (user.organization && user.organization.tenantId) {
                    this.dbContext.Organization
                        .findOne({ where: { tenantId: user.organization.tenantId } })
                        .then(organization => {
                            let p: Promise<any>;
                            if (organization == null) {
                                user.organization.created = new Date();
                                p = u.createOrganization(user.organization).catch(reject);
                            }
                            else
                                p = u.setOrganization(organization).catch(reject)
                            promises.push(p);
                        })
                }

                // update roles
                var newRoleNames = user.roles as string[];
                if (newRoleNames != null) {
                    u.getUserRoles().then(oldRoles => {
                        newRoleNames.forEach(newRoleName => {
                            if (oldRoles.findIndex(i => i.name == newRoleName) < 0) {
                                let p = u.createUserRole({ name: newRoleName }).catch(reject);
                                promises.push(p);
                            }
                        });
                        oldRoles.forEach(oldRole => {
                            if (newRoleNames.findIndex(i => i == oldRole.name) < 0) {
                                let p = u.removeUserRole(oldRole).catch(reject);
                                promises.push(p);
                            }
                        });
                    });
                }

                // wait all
                Promise.all(promises)
                    .then(() => resolve())
                    .catch(reject);
            });
        });
    }

    public unlinkUser(userId: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.getUserById(userId)
                .then(user => {
                    if (user != null) {
                        user.o365UserId = null;
                        user.o365Email = null;
                        user.save()
                            .then(() => resolve())
                            .catch(reject);
                    }
                    else
                        reject(`User ${userId} does not existed`);
                });
        });
    }

    public getAccessToken(resource: string): Promise<string> {
        return Promise.resolve('');
    }
}