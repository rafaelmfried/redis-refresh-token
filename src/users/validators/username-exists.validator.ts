import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from '../users.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class UsernameExistsValidator implements ValidatorConstraintInterface {
  constructor(@Inject(UsersService) private usersService: UsersService) {}

  async validate(username: string): Promise<boolean> {
    try {
      const user = await this.usersService.findOneByUsername(username);
      return !user;
    } catch (error) {
      throw new HttpException('Usuario ja existe', HttpStatus.NOT_ACCEPTABLE);
    }
  }

  defaultMessage(args: ValidationArguments): string {
    console.log(args);
    return 'O Usuario já existe: ($value).';
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
