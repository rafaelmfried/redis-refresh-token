import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.userRepository.create(createUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Não foi possivel criar o usuario.',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
      console.error(error);
    }
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepository.findOneBy({
        id,
      });
      return user;
    } catch (error) {
      throw new Error('Usuario não encontrado!');
      console.error(error);
    }
  }

  async findOneByUsername(username: string) {
    try {
      const user = await this.userRepository.findOneByOrFail({
        username,
      });
      return user;
    } catch (error) {
      throw new Error('Usuario não encontrado');
      console.error(error);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      return await this.userRepository.update({ id }, updateUserDto);
    } catch (error) {
      throw new Error('Não foi possivel atualizar o usuario.');
      console.error(error);
    }
  }

  async remove(id: string) {
    try {
      const user = await this.userRepository.findOneByOrFail({
        id,
      });
      return await this.userRepository.remove(user);
    } catch (error) {
      throw new Error('Não foi possivel deletar o usuario.');
      console.error(error);
    }
  }
}
