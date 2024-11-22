import {
  HttpException,
  Injectable,
  HttpStatus,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { BcryptService } from 'src/commom/utils/bcrypt.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => BcryptService))
    private readonly bcryptService: BcryptService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password } = createUserDto;
      console.log('Password: ', password);
      const hashedPassword = await this.bcryptService.hashPassword(password);
      console.log('hashedPasswrod: ', hashedPassword);
      const userData = { ...createUserDto, password: hashedPassword };
      console.log('userData: ', userData);
      const user = await this.userRepository.create(userData);
      return await this.userRepository.save(user);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error.message,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
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
      console.error(error);
      throw new Error('Usuario não encontrado!');
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
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      return await this.userRepository.update({ id }, updateUserDto);
    } catch (error) {
      console.error(error);
      throw new Error('Não foi possivel atualizar o usuario.');
    }
  }

  async remove(id: string) {
    try {
      const user = await this.userRepository.findOneByOrFail({
        id,
      });
      return await this.userRepository.remove(user);
    } catch (error) {
      console.error(error);
      throw new Error('Não foi possivel deletar o usuario.');
    }
  }
}
