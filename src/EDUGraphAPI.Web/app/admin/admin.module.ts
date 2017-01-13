import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AuthHelper } from "../authHelper/authHelper";
import { AdminService } from './admin.service';
import { DataService } from '../services/DataService';
import { AdminComponent } from './admin.component';
import { LinkedAccountsComponent } from './linkedAccounts.component';
import { routing } from './admin-routing';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        routing
    ],
    declarations: [
        AdminComponent,
        LinkedAccountsComponent],
    providers: [
        { provide: 'adminService', useClass: AdminService },
        { provide: 'auth', useClass: AuthHelper },
        { provide: 'dataService', useClass: DataService },
    ],
    bootstrap: [AdminComponent]
})

export class AdminModule {
}