import { Constants } from "../constants";

export class AuthorizationHelper {

    public static getUrl(redirectUrl: string, state: string, resource: string = null, prompt: string = null): string {
        var url = Constants.Authority + `oauth2/authorize?response_type=id_token` +
            `&client_id=` + encodeURIComponent(Constants.CientId) +
            `&resource=` + encodeURIComponent(resource) +
            `&redirect_uri=` + encodeURIComponent(redirectUrl) +
            `&state` + encodeURIComponent(state);
        if (resource != null && resource != '') url += "&resource=" + encodeURIComponent(resource);
        if (prompt != null && prompt != '') url += "&prompt=" + encodeURIComponent(prompt);
        return url;
    }
}

export class Prompt {
    public static readonly Consent = "consent";
    public static readonly Login = "login";
    public static readonly AdminConsent = "admin_consent";
}