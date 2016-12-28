import { ColorEntity } from '../models/common/colorEntity'
import { SvcConsts } from '../SvcConsts/SvcConsts';

export class RegisterModel {
    public Email: string;

    public Password: string;

    public ConfirmPassword: string;

    public FavoriteColors: ColorEntity[] = SvcConsts.FavoriteColors;

    public MyFavoriteColor: string;
}
