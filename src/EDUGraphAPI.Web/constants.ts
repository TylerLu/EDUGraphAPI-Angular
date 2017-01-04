export class Constants {

    public static readonly clientId = process.env.clientId as string;
    public static readonly clientSecret = process.env.clientSecret as string;
        
    public static readonly AADInstance = "https://login.microsoftonline.com/";
    public static readonly Authority = Constants.AADInstance + "common/";

    public static readonly MSGraphResource = "https://graph.microsoft.com";
    public static readonly AADGraphResource = "https://graph.windows.net";

    public static readonly sourceCodeRepositoryUrl = process.env.sourceCodeRepositoryUrl as string;

    public static readonly AADCompanyAdminRoleName = "Company Administrator";
}

export class O365ProductLicenses {
    /// <summary>
    /// Microsoft Classroom Preview
    /// </summary>
    public static readonly Classroom = "80f12768-d8d9-4e93-99a8-fa2464374d34";
    /// <summary>
    /// Office 365 Education for faculty
    /// </summary>
    public static readonly Faculty = "94763226-9b3c-4e75-a931-5c89701abe66";
    /// <summary>
    /// Office 365 Education for students
    /// </summary>
    public static readonly Student = "314c4481-f395-4525-be8b-2ec4bb1e9d91";
    /// <summary>
    /// Office 365 Education for faculty
    /// </summary>
    public static readonly FacultyPro = "78e66a63-337a-4a9a-8959-41c6654dfb56";
    /// <summary>
    /// Office 365 Education for students
    /// </summary>
    public static readonly StudentPro = "e82ae690-a2d5-4d76-8d30-7c6e01e6022e";
}

export class Roles {
    public static readonly Admin = "Admin";
    public static readonly Faculty = "Faculty";
    public static readonly Student = "Student";
}