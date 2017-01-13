import { JsonProperty } from '../utils/jsonhelper'

export class Conversation {

    @JsonProperty("topic")
    public topic: string;

    @JsonProperty("preview")
    public preview: string;

    @JsonProperty("id")
    public id: string;

    constructor() {
        this.topic = undefined;
        this.preview = undefined;
        this.id = undefined;
    }
}