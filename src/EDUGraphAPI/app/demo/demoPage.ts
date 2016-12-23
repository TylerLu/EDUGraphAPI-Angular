export class DemoPage {
    Controller: string;
    Action: string;
    Links: string[];
    constructor() {
        this.Links = [];
    }
}

export class Link {
    Title: string;
    Url: string;
}