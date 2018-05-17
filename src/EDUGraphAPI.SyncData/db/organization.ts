var Sequelize = require('sequelize');
var sequelize = require('./db');


var Organization = sequelize.define('organization', {
    name: Sequelize.STRING,
    tenantId: Sequelize.STRING,
    isAdminConsented: { type: Sequelize.BOOLEAN, allowNull: false },
    created: { type: Sequelize.DATE, allowNull: false }
},
    {
        timestamps: false,
        tableName: "Organizations"
    });




exports.getAllConsentedTenants = function (userName, email) {
    return Organization.findAll({ where: { isAdminConsented: 1  } });
};