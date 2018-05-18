/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/

var Sequelize = require('sequelize');
var sequelize = require('./db');


var User = sequelize.define('users', {
    o365UserId: Sequelize.STRING,
    JobTitle: Sequelize.STRING,
    Department: Sequelize.STRING,
    MobilePhone: Sequelize.STRING
},
    {
        timestamps: false,
        tableName: "users"
    });



exports.updateOrDeleteUser = function (users) {
    var usersCount = 0;

    return new Promise(function (resolve, reject) {
        handleUser(users[0]);

        function handleUser(user) {
            User.findOne({ where: { o365UserId: user.id } }).then(searchResult => {
            if (searchResult == null) {
                console.log("Skipping updating user " + user.id + " who does not exist in the local database.");
                handleNextUser();
            } else {
                if (user.isRemoved) {
                    User.destory({
                        where: { o365UserId: user.o365UserId }
                    }).then(function () {
                        handleNextUser();
                        console.log("Remove user with id " + user.o365UserId);
                     });
                    
                } else {
                    searchResult.updateAttributes({
                        JobTitle: user.jobTitle,
                        MobilePhone: user.mobilePhone,
                        Department: user.department
                    }).then(function () {
                        handleNextUser();                       
                    });;
                }
               
                }
            });
        }

        function handleNextUser() {
            usersCount++;
            if (usersCount == users.length) {
                console.log("Succeed");
                resolve('Succeed!');
            } else {
                handleUser(users[usersCount]);
            }
        }

    });
}