import { PartialType } from '@nestjs/mapped-types';
import { RefreshTokenCache } from './refresh_token_cache.dto';

export class UpdateCacheDto extends PartialType(RefreshTokenCache) {}
