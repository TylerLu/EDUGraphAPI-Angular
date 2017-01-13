import { ColorEntity } from '../models/common/colorEntity'
import { Constants } from '../constants';

export class CreateLocalModel {

    public password: string;

    public confirmPassword: string;

    public favoriteColors: ColorEntity[] = Constants.FavoriteColors;

    public favoriteColor: string;
}

export class LoginLocalModel {

    public email: string;

    public password: string;
}
