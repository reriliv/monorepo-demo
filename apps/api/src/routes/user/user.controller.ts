import { Controller, Get, } from '@nestjs/common';
import { UserService } from './user.service';

@Controller("/user")
export class UserController {
  constructor(private readonly userService: UserService) { }
  @Get()
  findAll() {
    return { users: this.userService.findAll() };
    // return "This action returns all users";
  }
}
