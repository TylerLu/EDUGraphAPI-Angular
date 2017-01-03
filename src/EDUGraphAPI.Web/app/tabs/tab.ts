import { Component, Input } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'tab',
    templateUrl: 'tab.html'
})
export class Tab {
    @Input('tabTitle') title: string;
    @Input() active = false;
}