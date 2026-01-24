import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSignUpDto } from './dto/request/user-signup.dto';
import { UserSignInDto } from './dto/request/user-signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
    
    @Post('signup')
    signUp(@Body() userSignUpDto: UserSignUpDto) {
      return this.authService.signUp(userSignUpDto);
    }
    
    @Post('signin')
    signIn(@Body() userSignIn: UserSignInDto){
      return this.authService.signIn(userSignIn);
    }
}
