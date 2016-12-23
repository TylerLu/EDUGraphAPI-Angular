import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Login } from './login/login.component';
import { Prod } from './prod/prod.component';
import { routing } from './app.routing';

@NgModule({
    imports: [BrowserModule, routing ],
    declarations: [AppComponent, Login, Prod ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
