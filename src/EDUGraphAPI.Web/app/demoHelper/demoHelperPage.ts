export class DemoHelperPage {
    component: string;
    action: string;
    links: string[];
    constructor() {
        this.component = undefined;
        this.action = undefined;
        this.links = [];
    }
}

export class Link {
    Title: string;
    Url: string;
}