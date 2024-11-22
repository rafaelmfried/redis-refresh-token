import { forwardRef, Inject, Injectable, Scope } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidationOptions,
  registerDecorator,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from 'src/users/users.service';

// N consigo pegar o contexto de usermodule aqui

@ValidatorConstraint({ async: true })
@Injectable({ scope: Scope.TRANSIENT })
export class UsernameExistsValidator implements ValidatorConstraintInterface {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async validate(username: string) {
    console.log('username: ', username);
    console.log('user repo: ', this.usersService);
    const user = await this.usersService.findOneByUsername(username);
    return !user;
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
