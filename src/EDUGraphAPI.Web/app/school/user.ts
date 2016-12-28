import { JsonProperty } from '../services/jsonhelper'
export class UserModel {
    @JsonProperty("mail")
    public Email: string;

    @JsonProperty("extension_fe2174665583431c953114ff7268b7b3_Education_ObjectType")
    public ObjectType: string;

    @JsonProperty("displayName")
    public DisplayName: string;

    @JsonProperty("extension_fe2174665583431c953114ff7268b7b3_Education_Grade")
    public EducationGrade: string;

    @JsonProperty("extension_fe2174665583431c953114ff7268b7b3_Education_SyncSource_SchoolId")
    public SchoolId: string;

    @JsonProperty("objectId")
    public O365UserId: string;

    @JsonProperty("extension_fe2174665583431c953114ff7268b7b3_Education_SyncSource_TeacherId")
    public TeacherId: string;

    @JsonProperty("extension_fe2174665583431c953114ff7268b7b3_Education_SyncSource_StudentId")
    public StudentId: string;

    public IsSeated: boolean = false;
    public SeatingClass: string = "seated hideitem";
    public ContainerClass: string = "unsaved";
    public SeatingArrangment: string = "0";

    constructor() {
        this.Email = undefined;
        this.ObjectType = undefined;
        this.DisplayName = undefined;
        this.EducationGrade = undefined;
        this.SchoolId = undefined;
        this.O365UserId = undefined;
        this.TeacherId = undefined;
        this.StudentId = undefined;
    }
}

export class StudentModel extends UserModel {
    @JsonProperty("extension_fe2174665583431c953114ff7268b7b3_Education_SyncSource_StudentId")
    public StudentId: string;

    constructor() {
        super();
        this.StudentId = undefined;
    }
}

export class TeacherModel extends UserModel {
    @JsonProperty("extension_fe2174665583431c953114ff7268b7b3_Education_SyncSource_TeacherId")
    public TeacherId: string;

    constructor() {
        super();
        this.TeacherId = undefined;
    }
}
