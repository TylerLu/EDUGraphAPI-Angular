import { Constants } from "../constants";

export class AuthorizationHelper {

    public static getUrl(responseType: string, redirectUrl: string, state: string, resource: string = null, prompt: string, nonce: string): string {
        var url = Constants.Authority + `oauth2/authorize
            ?response_type=` + encodeURIComponent(responseType) + 
            `&client_id=` + encodeURIComponent(Constants.CientId) +
            `&redirect_uri=` + encodeURIComponent(redirectUrl) +
            `&state=` + encodeURIComponent(state) +
            `&resource=` + encodeURIComponent(resource) +
            `&nonce=` + encodeURIComponent(nonce) +
            `&prompt=` + encodeURIComponent(prompt);
        return url;
    }
}

export class Prompt {
    public static readonly Consent = "consent";
    public static readonly Login = "login";
    public static readonly AdminConsent = "admin_consent";
}