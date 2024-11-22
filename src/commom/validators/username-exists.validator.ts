import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidationOptions,
  registerDecorator,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from 'src/users/users.service';

// N consigo pegar o contexto de usermodule aqui

@ValidatorConstraint({ async: true })
@Injectable()
export class UsernameExistsValidator implements ValidatorConstraintInterface {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {
    console.log(this.usersService);
  }

  async validate(username: string) {
    console.log('username: ', username);
    console.log('user repo: ', this.usersService);
    try {
      const user = await this.usersService.findOneByUsername(username);
      return !user;
    } catch (error) {
      console.log('error: ', error);
      throw new HttpException('Usuario ja existe', HttpStatus.NOT_ACCEPTABLE);
    }
  }

  defaultMessage(): string {
    return 'Este nome de usuário já está em uso';
  }
}

export function UsernameExists(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'usernameExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UsernameExistsValidator,
    });
  };
}
