export class Constants {

    public static readonly Host: string = process.env.WEBSITE_HOSTNAME as string;

    public static readonly clientId: string = process.env.clientId as string;
    public static readonly clientSecret: string = process.env.clientSecret as string;

    public static readonly AADInstance: string = "https://login.microsoftonline.com/";
    public static readonly Authority: string = Constants.AADInstance + "common/";

    public static readonly MSGraphResource: string = "https://graph.microsoft.com";
    public static readonly AADGraphResource: string = "https://graph.windows.net";

    public static readonly sourceCodeRepositoryUrl: string = process.env.sourceCodeRepositoryUrl as string;

    public static readonly AADCompanyAdminRoleName: string = "Company Administrator";

    public static readonly identityMetadata: string = 'https://login.microsoftonline.com/common/.well-known/openid-configuration';

    //Required, must be 'code', 'code id_token', 'id_token code' or 'id_token' 
    public static readonly responseType: string = 'code';

    // Required
    public static readonly responseMode: string = 'form_post';

    // Required, the reply URL registered in AAD for your app
    public static readonly redirectUrl: string = '/auth/openid/return';

    // Required if we use http for redirectUrl
    public static readonly allowHttpForRedirectUrl: boolean = true;

    // Required  to set to false if you don't want to validate issuer
    public static readonly validateIssuer: boolean = false;

    // Required to set to true if the `verify` function has 'req' as the first parameter
    public static readonly passReqToCallback: boolean = true;

    // Optional. The additional scope you want besides 'openid', for example: ['email', 'profile'].
    public static readonly scope: Array<string> = null;

    // Optional, 'error', 'warn' or 'info'
    public static readonly loggingLevel: string = 'info';

    // Optional. The lifetime of nonce in session, the default value is 3600 (seconds).
    public static readonly nonceLifetime: number = null;

    // The url you need to go to destroy the session with AAD
    public static readonly destroySessionUrl: string = 'https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=';

    //SQL config 
    public static readonly SQLServerDatabase: string = 'EDUGraphAPI2DEV';
    public static readonly SQLServerUsername: string = 'EduGraphAPI';
    public static readonly SQLServerPassword: string = 'EDRF8Uu6PVG6UVi';
    public static readonly SQLServerHost: string = 'edugraphapi2dev.database.windows.net';
}

export class O365ProductLicenses {
    /// <summary>
    /// Microsoft Classroom Preview
    /// </summary>
    public static readonly Classroom: string = "80f12768-d8d9-4e93-99a8-fa2464374d34";
    /// <summary>
    /// Office 365 Education for faculty
    /// </summary>
    public static readonly Faculty: string = "94763226-9b3c-4e75-a931-5c89701abe66";
    /// <summary>
    /// Office 365 Education for students
    /// </summary>
    public static readonly Student: string = "314c4481-f395-4525-be8b-2ec4bb1e9d91";
    /// <summary>
    /// Office 365 Education for faculty
    /// </summary>
    public static readonly FacultyPro: string = "78e66a63-337a-4a9a-8959-41c6654dfb56";
    /// <summary>
    /// Office 365 Education for students
    /// </summary>
    public static readonly StudentPro: string = "e82ae690-a2d5-4d76-8d30-7c6e01e6022e";
}

export class Roles {
    public static readonly Admin: string = "Admin";
    public static readonly Faculty: string = "Faculty";
    public static readonly Student: string = "Student";
}