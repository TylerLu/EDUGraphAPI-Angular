import { JsonProperty } from '../utils/jsonhelper'
export class SeatingArrangement {
    @JsonProperty("position")
    position: string;

    @JsonProperty("o365UserId")
    o365UserId: string;

    @JsonProperty("classId")
    classId: string;
    constructor() {
        this.position = undefined;
        this.o365UserId = undefined;
        this.classId = undefined;
    }
}