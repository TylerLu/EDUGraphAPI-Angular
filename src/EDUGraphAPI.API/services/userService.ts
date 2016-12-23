import express = require('express');
import * as Sequelize from 'sequelize';
import * as Storage from '../data/dbContext';
import * as uuid from "node-uuid";
import * as Promise from "bluebird";

var bcrypt = require('bcryptjs');
var dbContext = new Storage.DbContext();


export function creatUser(email: string, password: string, favoriteColor: string): Promise<any>{
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10)
            .then((salt) => {
                bcrypt.hash(password, salt).then((hash) => {
                    dbContext.User.create(
                        {
                            id: uuid.v4(),
                            email: email,
                            passwordHash: hash,
                            salt: salt,
                            favoriteColor: favoriteColor
                        })
                        .then((user) => {
                            resolve(user);
                        })
                        .catch((error: any) => {
                            reject(error);
                        });
                })
            })
            .catch((error: any) => {
                reject(error);
            });
    });
}

//by email and password
export function validUser(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
        dbContext.User
            .findAll({ where: { email: email } })
            .then((users) => {
                if (users.length > 0) {
                    let step = 0;
                    for (let item of users) {
                        let salt = item.salt;
                        let passwordHash = item.passwordHash
                        bcrypt.hash(password, salt)
                            .then((hash) => {
                                if (hash === passwordHash) {
                                    return resolve(item);
                                }
                                else {
                                    step++;
                                    if (step == users.length) {
                                        return resolve("");
                                    }
                                }
                            })
                            .catch((error: any) => {
                                reject(error);
                            });

                    }
                }
                else {
                    return resolve("");
                }
            })
            .catch((error: any) => {
                reject(error);
            });

    });
}

export function getUserById(userId: string): Promise<any> {
    return new Promise((resolve, reject) => {
        dbContext.User.findById(userId)
            .then((item) => {
                resolve(item);
            })
    });
}