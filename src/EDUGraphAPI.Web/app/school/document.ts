import { JsonProperty } from '../services/jsonhelper'
import { UserModel} from './user'
export class Document {
    @JsonProperty("name")
    public Name: string;

    @JsonProperty("webUrl")
    public webUrl: string;
    @JsonProperty("lastModifiedDateTime")
    public lastModifiedDateTime: string;

    public LastModifiedBy: UserModel;

    constructor() {
        this.Name = undefined;
        this.webUrl = undefined;
        this.lastModifiedDateTime = undefined;
        this.LastModifiedBy = undefined;
    }
}

export class OneDrive {
    @JsonProperty("webUrl")
    public webUrl: string;
    constructor() {
        this.webUrl = undefined;
    }
}


