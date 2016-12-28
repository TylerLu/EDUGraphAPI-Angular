export class Constants {

    public static readonly clientId = process.env.clientId as string;
    public static readonly clientSecret = process.env.clientSecret as string;
        
    public static readonly AADInstance = "https://login.microsoftonline.com/";
    public static readonly Authority = Constants.AADInstance + "common/";

    public static readonly MSGraphResource = "https://graph.microsoft.com";
    public static readonly AADGraphResource = "https://graph.windows.net";

    public static readonly sourceCodeRepositoryUrl = process.env.sourceCodeRepositoryUrl as string;
}