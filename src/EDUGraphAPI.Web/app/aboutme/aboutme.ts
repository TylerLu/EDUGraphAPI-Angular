import { ColorEntity } from '../models/common/colorEntity'
export class AboutMeModel {

    public UserName: string;

    public IsLinked: boolean;

    public MyFavoriteColor: string;

    public FavoriteColors: ColorEntity[];

    public Groups: string[];

    public ShowFavoriteColor: boolean;

    public SaveSucceeded: boolean = false;

    constructor() {
        this.UserName = undefined;
        this.IsLinked = undefined;
        this.MyFavoriteColor = undefined;
        this.FavoriteColors = undefined;
        this.Groups = undefined;
        this.ShowFavoriteColor = undefined;
    }
}