import {DataSource,DataSourceOptions} from 'typeorm';
import  'dotenv/config'
import { envs } from 'config';



export const datasourceOptions : DataSourceOptions = {
    type : 'postgres',
    host : envs.host,
    port : envs.dbPort,
    username : envs.userNameDb,
    password : envs.passwordDb,
    database : envs.databaseName,
    entities : [],
    migrations : [],
    logging : false,
    synchronize : true
}



export const dataSource = new DataSource(datasourceOptions);

