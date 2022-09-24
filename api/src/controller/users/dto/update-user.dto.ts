import { IsOptional, IsString } from 'class-validator';
import { classValidatorMessages } from '../../../utils/validators/class-validator-messages';

const { isString } = classValidatorMessages;

export class UpdateUserDto {
  @IsOptional()
  @IsString({
    message: isString,
  })
  name?: string;

  @IsOptional()
  @IsString({
    message: isString,
  })
  work?: string;

  @IsOptional()
  @IsString({
    message: isString,
  })
  hobby?: string;

  @IsOptional()
  @IsString({
    message: isString,
  })
  password?: string;
}
