import { ColorEntity } from '../models/common/colorEntity'
import { SvcConsts } from '../SvcConsts/SvcConsts';
import { UserInfo } from '../models/common/userInfo'

export class RegisterModel extends UserInfo{
    public ConfirmPassword: string;
    public FavoriteColors: ColorEntity[] = SvcConsts.FavoriteColors;
}
