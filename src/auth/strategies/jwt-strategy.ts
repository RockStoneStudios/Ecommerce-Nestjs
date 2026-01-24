import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { envs } from "config";
import { ExtractJwt, Strategy } from "passport-jwt";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    
    constructor(){
        super({
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration : false,
            secretOrKey : envs.jwtSecret
        })
    }

    async validate(payload : any) {
      
        return {
            id: payload.sub,      // Importante para el @CurrentUser
            email: payload.email, 
            roles: payload.roles
        }
    }

}