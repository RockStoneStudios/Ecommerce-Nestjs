import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { DataSource } from "typeorm";



@Injectable()
export class DataService implements OnModuleInit {
    private readonly logger = new Logger(DataService.name);
    
    constructor(private readonly dataSource : DataSource){}
    
    onModuleInit() {
        if(this.dataSource.isInitialized){
            this.logger.log('✅ Conexión a la base de datos exitosa')
        }else {
             this.logger.error('❌ La base de datos no se inicializó');
        }
    }

}