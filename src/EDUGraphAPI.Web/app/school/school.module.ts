import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AuthHelper } from "../authHelper/authHelper";
import { SchoolService } from './school.service';
import { DataService } from '../services/DataService';
import { SchoolComponent } from './school.component';
import { routing } from './school-routing';
import { ClassesComponent } from './classes.component';
import { MyClassesComponent } from './myclasses.component';
import { UsersComponent } from './users.component';
import { ClassDetailComponent } from './classdetail.component';
import { Tabs } from '../tabs/tabs';
import { Tab } from '../tabs/tab';
import { CustomPosition, CustomUserId, CustomRealHeader, CustomPrevPosition} from './customdirectives';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        routing
    ],
    declarations: [SchoolComponent, ClassesComponent, MyClassesComponent, UsersComponent,
        ClassDetailComponent, Tabs, Tab, CustomPosition, CustomUserId, CustomRealHeader, CustomPrevPosition],
    providers: [
        { provide: 'schoolService', useClass: SchoolService },
        { provide: 'auth', useClass: AuthHelper },
        { provide: 'dataService', useClass: DataService },
    ],
    bootstrap: [SchoolComponent]
})
export class SchoolModule { }
