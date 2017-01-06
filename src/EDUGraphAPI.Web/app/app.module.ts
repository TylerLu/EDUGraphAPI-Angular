import { NgModule, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CustomFormsModule } from 'ng2-validation'

import { AppComponent }   from './app.component';
import { Login } from './login/login.component';
import { Header } from './header/header.component';
import { DemoHelper } from './demoHelper/demoHelper.component';
import { DemoHelperService } from './demoHelper/demoHelperService';
import { routing } from './app.routing';
import { AuthHelper } from "./authHelper/authHelper";
import { DataService} from "./services/dataService";
import { UserService} from "./services/userService";
import { MeService} from "./services/meService";
import { JsonProperty, MapUtils } from "./services/jsonHelper";
import { SchoolModule } from './school/school.module';
import { AdminModule } from './admin/admin.module';
import { LinkModule } from './link/link.module';
import { Register } from './register/register.component';
import { AboutMe } from './aboutme/aboutme.component';
import { AboutMeService } from './aboutme/aboutme.service';



@NgModule({
    imports: [BrowserModule, FormsModule, ReactiveFormsModule, CustomFormsModule, routing, HttpModule, SchoolModule,AdminModule,LinkModule],
    declarations: [AppComponent, Login, Register, Header,DemoHelper, AboutMe],
    bootstrap: [AppComponent],
    providers: [
        { provide: 'auth', useClass: AuthHelper },
        { provide: 'data', useClass: DataService },
        { provide: 'demoHelperService', useClass: DemoHelperService },
        { provide: 'aboutMeService', useClass: AboutMeService },
        { provide: 'me', useClass: MeService },
        { provide: 'user', useClass: UserService }
    ]
})

export class AppModule {
    
}