import { JsonProperty } from '../utils/jsonhelper'
import { UserModel } from './user'

export class Document {
    @JsonProperty("name")
    public Name: string;

    @JsonProperty("webUrl")
    public webUrl: string;

    @JsonProperty("lastModifiedDateTime")
    public lastModifiedDateTime: string;

    public LastModifiedBy: string = "";

    constructor() {
        this.Name = undefined;
        this.webUrl = undefined;
        this.lastModifiedDateTime = undefined;
        this.LastModifiedBy = "";
    }
}

export class OneDrive {

    @JsonProperty("webUrl")
    public webUrl: string;

    constructor() {
        this.webUrl = undefined;
    }
}