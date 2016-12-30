import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component'
import { LinkedAccountsComponent } from './linkedAccounts.component'
import { UnlinkAccountComponent } from './unlinkAccount.component'

const routes: Routes = [
    { path: 'admin', component: AdminComponent },
    { path: 'linkedAccounts', component: LinkedAccountsComponent },
    { path: 'unlinkAccount/:id', component: UnlinkAccountComponent }
];

export const routing = RouterModule.forChild(routes);

