import { ColorEntity } from '../models/common/colorEntity'
import { SvcConsts } from '../SvcConsts/SvcConsts';

export class CreateLocalModel {
    public password: string;
    public confirmPassword: string;

    public favoriteColors: ColorEntity[] = SvcConsts.FavoriteColors;

    public favoriteColor: string;
}

export class LoginLocalModel {
    public email: string;
    public password: string;
}
