﻿import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component'
import { LinkedAccountsComponent } from './linkedAccounts.component'

const routes: Routes = [
    { path: 'admin', component: AdminComponent },
    { path: 'linkedAccounts', component: LinkedAccountsComponent },
];

export const routing = RouterModule.forChild(routes);

