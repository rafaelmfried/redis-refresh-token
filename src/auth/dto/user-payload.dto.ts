import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class IUserPayload {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
