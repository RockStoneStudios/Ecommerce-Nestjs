
import 'dotenv/config';
import * as joi from 'joi';

/**
 * PORT=3000
DB_HOST= localhost
DB_PORT=5432
DB_USERNAME=omar
DB_PASSWORD=123456
DB_DATABASE=ecommerce
 */

interface EnvVars {
    PORT: number;
    DB_HOST : string;
    DB_PORT : number;
    DB_USERNAME :string;
    DB_PASSWORD : string;
    DB_DATABASE : string;
    JWT_SECRET :string

}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    DB_HOST : joi.string().default('localhost'),
    DB_PORT : joi.number().default(5432),
    DB_USERNAME : joi.string().required(),
    DB_PASSWORD : joi.string().required(),
    DB_DATABASE : joi.string().required(),
    JWT_SECRET : joi.string().required()
}).unknown(true);

const {error, value} = envsSchema.validate(process.env);

if(error) {
    throw new Error(`Config validation error : ${error.message}`)
}

const envVars : EnvVars = value;

export const envs = {
    port: envVars.PORT,
    host : envVars.DB_HOST,
    dbPort : envVars.DB_PORT,
    userNameDb : envVars.DB_USERNAME,
    passwordDb : envVars.DB_PASSWORD,
    databaseName : envVars.DB_DATABASE,
    jwtSecret : envVars.JWT_SECRET
}