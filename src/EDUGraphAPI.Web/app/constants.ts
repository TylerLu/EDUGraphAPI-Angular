export class Constants {

    public static readonly CientId = "37443f61-5fe1-4a1b-8778-e251b3df885b";
    public static readonly TenantId = "canvizEDU.onmicrosoft.com";
    public static readonly AADInstance = "https://login.microsoftonline.com/";
    public static readonly Authority = Constants.AADInstance + "common/";
    public static readonly TokenProcessorUrl = "https://localhost:44380/node_modules/kurvejs/dist/login.html";
    public static readonly MSGraphResource = "https://graph.microsoft.com";
    public static readonly AADGraphResource = "https://graph.windows.net";
}
export class Roles {
    public static readonly Admin = "Admin";
    public static readonly Faculty = "Faculty";
    public static readonly Student = "Student";
}