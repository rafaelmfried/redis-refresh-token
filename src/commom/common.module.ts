import { forwardRef, Module } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { UsersModule } from 'src/users/users.module';
import { UsernameExistsValidator } from './validators/username-exists.validator';

@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [HttpExceptionFilter, UsernameExistsValidator],
  exports: [HttpExceptionFilter, UsernameExistsValidator],
})
export class CommonModule {}
