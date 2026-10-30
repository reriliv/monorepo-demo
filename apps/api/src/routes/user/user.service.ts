import type { User } from '@demo/shared';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor() { }

  findAll(): User[] {
    return [];
  }
}
