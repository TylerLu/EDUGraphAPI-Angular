import { JsonProperty } from '../services/jsonhelper'
export class LinkedAccountModel {
    @JsonProperty("id")
    Id: string;
    @JsonProperty("email")
    Email: string;
    @JsonProperty("o365Email")
    O365Email: string;
}
