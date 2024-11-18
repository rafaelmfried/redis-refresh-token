import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { UsersService } from 'src/users/users.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class UsernameExistsValidator implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}

  async validate(username: string) {
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
