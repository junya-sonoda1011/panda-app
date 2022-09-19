import { IsNotEmpty, IsString } from 'class-validator';
import { classValidatorMessages } from '../../../utils/validators/class-validator-messages';

const { isNotEmpty, isString } = classValidatorMessages;

export class SaveUserDto {
  @IsNotEmpty({
    message: isNotEmpty,
  })
  @IsString({
    message: isString,
  })
  name: string;

  @IsString({
    message: isString,
  })
  work: string;

  @IsString({
    message: isString,
  })
  hobby: string;

  @IsNotEmpty({
    message: isNotEmpty,
  })
  @IsString({
    message: isString,
  })
  password: string;
}
