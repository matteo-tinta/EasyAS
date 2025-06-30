import { raise } from "./raise";

type ENVIRONMENT = {
    DB_CONN_STRING: string,
    DB_NAME: string,
}

export const ENVIRONMENT: ENVIRONMENT = {
    DB_CONN_STRING: process.env["DB_CONN_STRING"] ?? raise("DB_CONN_STRING is mandatory"),
    DB_NAME: process.env["DB_NAME"] ?? raise("DB_NAME is mandatory"),
}