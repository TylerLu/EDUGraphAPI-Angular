import * as request from 'superagent';
import * as microsoftGraph from "microsoft-graph-typings"

export class UserService {
    private MS_GRAPH_RESOURCE: string = "https://graph.microsoft.com";
    public getMe(accessToken: string): Promise<any> {
        return new Promise((resolve, reject) => {

        })
    }
}