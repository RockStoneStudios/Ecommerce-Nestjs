import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { map, Observable } from "rxjs";

// Definimos una interfaz para asegurar que nos pasen una clase
interface ClassConstructor {
  new (...args: any[]): {};
}

// Decorador personalizado para que sea más fácil de usar
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}


export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: any) => {
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true, // 👈 Esto elimina id, createdAt, etc., si no tienen @Expose en el DTO
        });
      }),
    );
  }
}