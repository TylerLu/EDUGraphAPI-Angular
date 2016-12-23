import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `<h1>Hello {{name}}</h1><a href="/prod">prod</a><br/><a href="/">login</a><router-outlet></router-outlet>`,
})
export class AppComponent  { name = 'Angular'; }
