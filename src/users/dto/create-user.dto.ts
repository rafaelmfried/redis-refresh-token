import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  Matches,
} from 'class-validator';
import { UsernameExists } from 'src/commom/validators/username-exists.validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'O email deve ser válidado' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  email: string;

  @IsString({ message: 'O nome de usuário deve ser uma string' })
  @IsNotEmpty({ message: 'O nome de usuário ê obrigatório' })
  @UsernameExists({ message: 'Nome de usuário já existe' })
  username: string;

  @IsNotEmpty({ message: 'A senha é obrigatoria' })
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
  @Matches(/[0-9]/, { message: 'A senha deve conter pelo menos um número' })
  @Matches(/[A-Z]/, {
    message: 'A senha deve conter pelo menos uma letra maiúscula',
  })
  @Matches(/[a-z]/, {
    message: 'A senha deve conter pelo menos uma letra minúscula',
  })
  @Matches(/[@$!%*?&]/, {
    message: 'A senha deve conter pelo menos um símbolo especial',
  })
  password: string;
}
