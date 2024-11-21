import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { UsersService } from 'src/users/users.service';

// N consigo pegar o contexto de usermodule aqui

@ValidatorConstraint({ async: true })
@Injectable()
export class UsernameExistsValidator implements ValidatorConstraintInterface {
  private readonly userService: UsersService;
  constructor(private readonly moduleRef: ModuleRef) {}

  async validate(username: string) {
    console.log('username: ', username);
    const user = await this.userService.findOneByUsername(username);
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
