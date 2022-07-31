import { IsNotEmpty, IsString } from 'class-validator';

export class SaveUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  work: string;

  @IsNotEmpty()
  @IsString()
  hobby: string;
}
