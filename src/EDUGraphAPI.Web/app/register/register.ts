import { ColorEntity } from '../models/common/colorEntity'
import { Constants } from '../constants';
import { UserInfo } from '../models/common/userInfo'

export class RegisterModel{
    public ConfirmPassword: string;
    public FavoriteColors: ColorEntity[] = Constants.FavoriteColors;
    public UserInfo: UserInfo = new UserInfo();
}
