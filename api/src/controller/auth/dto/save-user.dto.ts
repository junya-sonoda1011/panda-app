import { IsNotEmpty, IsString } from 'class-validator';

export class SaveUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  work: string;

  @IsString()
  hobby: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
