import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import { envs } from 'config';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './strategies/jwt-strategy';

@Module({
  imports : [
    PassportModule,
    UsersModule,
    PassportModule,
    JwtModule.register({
      global : true,
      secret : envs.jwtSecret,
      signOptions : {expiresIn : '10d'}
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
