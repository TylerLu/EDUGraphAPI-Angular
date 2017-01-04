import { ColorEntity } from '../models/common/colorEntity'
import { SvcConsts } from '../SvcConsts/SvcConsts';
import { UserInfo } from '../models/common/userInfo'

export class RegisterModel{
    public ConfirmPassword: string;
    public FavoriteColors: ColorEntity[] = SvcConsts.FavoriteColors;
    public UserInfo: UserInfo = new UserInfo();
}
