import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, } from '@nestjs/common';
import { UserService } from './user.service';
import { UserModel } from '../../generated/prisma/models';

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async findAll(@Query('search') search?: string): Promise<UserModel[]> {
    return this.userService.users({
      where: search ? {
        OR: [
          { username: { contains: search } },
          { email: { contains: search } },
        ],
      } : undefined,
      orderBy: { id: 'asc' },
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserModel | null> {
    return this.userService.user({ id });
  }

  @Post()
  async create(@Body() userData: { username: string; email: string; }): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<UserModel> {
    return this.userService.deleteUser({ id });
  }
}
