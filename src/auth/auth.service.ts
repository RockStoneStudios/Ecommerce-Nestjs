import { 
  Injectable, 
  ConflictException, 
  InternalServerErrorException, 
  NotFoundException, 
  UnauthorizedException 
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
// Importa tus DTOs e Interfases según tu estructura
import { UserSignUpDto } from './dto/request/user-signup.dto';
import { UserSignInDto } from './dto/request/user-signin.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    private readonly NUMBER_GENERATION=10;
  constructor(
     
    private userService : UsersService,
    // Inyectamos el servicio de JWT oficial de NestJS
    private jwtService: JwtService,
  ) {}

  async signUp(userSignUpDto: UserSignUpDto) {
    const { name, email, password,roles } = userSignUpDto;
    
    // 1. Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, this.NUMBER_GENERATION);

    try {
     
      const userSave = await this.userService.create({
        name,
        email,
        password: hashedPassword,
        roles
      });

      // 3. Generar el payload y el token
      const payload = { sub: userSave.id, email: userSave.email, roles: userSave.roles };
      
      const { password: _, ...userWithOutPassword } = userSave;
      
      return {
        user: userWithOutPassword,
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      // Error de duplicado en PostgreSQL (23505) o MongoDB (11000)
      if (error.code === '23505') {
        throw new ConflictException('Este email ya existe');
      }
      throw new InternalServerErrorException('Error de Servidor al registrar');
    }
  }

  async signIn(userSignInDto: UserSignInDto) {
    const { email, password } = userSignInDto;

    // 1. Buscar usuario
    const userExist = await this.userService.findUserByEmail(email); // Ajusta según tu repo
    if (!userExist) {
      throw new NotFoundException(`El usuario con email ${email} no existe`);
    }

    // 2. Comparar contraseñas
    const isPasswordMatching = await bcrypt.compare(password, userExist.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Las credenciales son incorrectas');
    }

    // 3. Generar JWT
    const payload = { sub: userExist.id, email: userExist.email, roles: userExist.roles };
    
    const { password: _, ...userWithOutPassword } = userExist;

    return {
      user: userWithOutPassword,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

 
}