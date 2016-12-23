"use strict";
var router_1 = require("@angular/router");
var login_component_1 = require("./login/login.component");
var prod_component_1 = require("./prod/prod.component");
var appRoutes = [
    {
        path: 'prod',
        component: prod_component_1.Prod
    },
    {
        path: '**',
        component: login_component_1.Login
    }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map