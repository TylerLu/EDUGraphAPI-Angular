import { Component, Input } from '@angular/core';

@Component({
    selector: 'tab',
    templateUrl: 'app/tabs/tab.html'
})
export class Tab {
    @Input('tabTitle') title: string;
    @Input() active = false;
}