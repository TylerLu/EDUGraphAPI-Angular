import { NgModule, Inject}      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HttpModule } from '@angular/http';

import { AppComponent }   from './app.component';
import { Login } from './login/login.component';
import { Header } from './header/header.component';
import { Link } from './link/link.component';
import { LinkService } from './link/link.service';
import { Demo } from './demo/demo.component';
import { DemoService } from './demo/demoService';
import { routing } from './app.routing';
import { AuthHelper } from "./authHelper/authHelper";
import { DataService} from "./services/dataService";
import { UserService} from "./services/userService";
import { MeService} from "./services/meService";
import { JsonProperty, MapUtils } from "./services/jsonHelper";
import { SchoolModule } from './school/school.module';
import { AdminModule } from './admin/admin.module';
import { Register } from './register/register.component';
import { AboutMeComponent } from './aboutme/aboutme.component';
import { AboutMeService } from './aboutme/aboutme.service';



@NgModule({
    imports: [BrowserModule, routing, HttpModule, SchoolModule,AdminModule],
    declarations: [AppComponent, Login, Register, Header, Link, Demo, AboutMeComponent],
    bootstrap: [AppComponent],
    providers: [
        { provide: 'auth', useClass: AuthHelper },
        { provide: 'data', useClass: DataService },
        { provide: 'demoService', useClass: DemoService },
        { provide: 'linkService', useClass: LinkService },
        { provide: 'aboutMeService', useClass: AboutMeService },
        { provide: 'me', useClass: MeService }
    ]
})

export class AppModule {
    
}