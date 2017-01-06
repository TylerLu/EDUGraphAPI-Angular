import { ColorEntity } from './models/common/colorEntity'

export class Constants {

    public static readonly CientId = "%CientId%";
    public static readonly TenantId = "canvizEDU.onmicrosoft.com";
    public static readonly AADInstance = "https://login.microsoftonline.com/";
    public static readonly Authority = Constants.AADInstance + "common/";
    public static readonly TokenProcessorUrl = "https://localhost:44380/node_modules/kurvejs/dist/login.html";
    public static readonly MSGraphResource = "https://graph.microsoft.com";
    public static readonly AADGraphResource = "https://graph.windows.net";
    public static COOKIE_TOKEN: string = "user_token_ad";
    public static MS_COOKIE_TOKEN: string = "user_token_ms";
    public static LOGIN_TOKEN = "authType";
    public static BING_MAP_KEY: string = "%BingMapKey%";
    public static FavoriteColors: ColorEntity[] = [new ColorEntity("Blue", "#2F19FF"), new ColorEntity("Green", "#127605"), new ColorEntity("Grey", "#535353")];
}
export class Roles {
    public static readonly Admin = "Admin";
    public static readonly Faculty = "Faculty";
    public static readonly Student = "Student";
}

