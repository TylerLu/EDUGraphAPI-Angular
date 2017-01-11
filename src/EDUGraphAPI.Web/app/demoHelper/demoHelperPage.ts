export class DemoHelperPage {
    component: string;
    links: Link[];
    constructor() {
        this.component = undefined;
        this.links = [];
    }
}

export class Link {
    title: string;
    url: string;
}