import { NgModule, Inject}      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HttpModule } from '@angular/http';

import { AppComponent }   from './app.component';
import { Login } from './login/login.component';
import { Header } from './header/header.component';
import { Demo } from './demo/demo.component';
import { routing } from './app.routing';
import { AuthHelper } from "./authHelper/authHelper";
import { DataService} from "./services/dataService";
import { JsonProperty, MapUtils } from "./services/jsonHelper";
import { SchoolModule } from './school/school.module';
import { AdminModule } from './admin/admin.module';
import { Register } from './register/register.component';




@NgModule({
    imports: [BrowserModule, routing, HttpModule, SchoolModule,AdminModule],
    declarations: [AppComponent, Login, Register, Header, Demo],
    bootstrap: [AppComponent],
    providers: [
        { provide: 'auth', useClass: AuthHelper },
        { provide: 'data', useClass: DataService }
    ]
})

export class AppModule {
    
}