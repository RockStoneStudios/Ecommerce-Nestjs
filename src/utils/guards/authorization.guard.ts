import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";




@Injectable()
export class AuthorizedGuard implements CanActivate{

    constructor(private reflector : Reflector){}

 canActivate(context: ExecutionContext): boolean {
    // 1. Obtenemos los roles permitidos por el decorador
    const allowedRoles = this.reflector.get<string[]>('allowedRoles', context.getHandler());
    
    // Si el controlador no tiene el decorador @AuthorizedRoles, permitimos el paso
    if (!allowedRoles) return true;

    const request = context.switchToHttp().getRequest();
    
    // 2. IMPORTANTE: NestJS guarda el resultado de la estrategia en request.user
    const user = request.user; 

    // 3. Verificamos si el usuario existe y tiene roles
    if (!user || !user.roles) {
        throw new UnauthorizedException('User roles not found');
    }
    // 4. Verificamos si alguno de los roles del usuario está en la lista de permitidos
    const hasRole = user.roles.some((role: string) => allowedRoles.includes(role));

    if (hasRole) return true;

    throw new UnauthorizedException('Sorry you are not authorized');
  }

}