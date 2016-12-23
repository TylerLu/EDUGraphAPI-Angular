import { Injectable } from "@angular/core";
import { SvcConsts } from "../svcConsts/svcConsts";
import { Cookie } from '../services/cookieService'
@Injectable()
export class AuthHelper {
	//function to parse the url query string
	private parseQueryString = function(url) {
		var params = {}, queryString = url.substring(1),
		regex = /([^&=]+)=([^&]*)/g, m;
		while (m = regex.exec(queryString)) {
			params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
		}
		return params;
	}
	private params = this.parseQueryString(location.hash);
	public access_token:string = null;
	
    constructor() {
        this.access_token = Cookie.get(SvcConsts.COOKIE_TOKEN);
        //check for id_token or access_token in url
        if (this.access_token ==null){
            if (this.params["id_token"] != null)
                this.getAccessToken();
            else if (this.params["access_token"] != null) {
                this.access_token = this.params["access_token"];
                Cookie.set(SvcConsts.COOKIE_TOKEN, this.access_token,10);
            }
        }
	}
	
	login() {
		//redirect to get id_token
		window.location.href = "https://login.microsoftonline.com/" + SvcConsts.TENANT_ID + 
			"/oauth2/authorize?response_type=id_token&client_id=" + SvcConsts.CLIENT_ID + 
			"&redirect_uri=" + encodeURIComponent(window.location.href) + 
			"&state=SomeState&nonce=SomeNonce";
	}
	
	private getAccessToken() {
		//redirect to get access_token
		window.location.href = "https://login.microsoftonline.com/" + SvcConsts.TENANT_ID + 
			"/oauth2/authorize?response_type=token&client_id=" + SvcConsts.CLIENT_ID + 
            "&resource=" + SvcConsts.AAD_Graph_RESOURCE + 
			"&redirect_uri=" + encodeURIComponent(window.location.href) + 
			"&prompt=none&state=SomeState&nonce=SomeNonce";
	}
}
