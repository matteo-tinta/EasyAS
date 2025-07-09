import { raise } from "./raise";

type ENVIRONMENT = {
    DB_CONN_STRING: () => string,
    DB_NAME: () => string,
    PDP_HOST: () => string,
    PDP_ROLE_ENDPOINT: () => string,
    PDP_INTERROGATE_CALLBACK: () => string,
    HAS_ROLE: () => boolean
}

export const ENVIRONMENT: ENVIRONMENT = {
    DB_CONN_STRING: () => process.env["DB_CONN_STRING"] ?? raise("DB_CONN_STRING is mandatory"),
    DB_NAME: () => process.env["DB_NAME"] ?? raise("DB_NAME is mandatory"),
    PDP_HOST: () => process.env["PDP_HOST"] ?? "",
    PDP_ROLE_ENDPOINT: () => process.env["PDP_ROLE_ENDPOINT"] ?? "",
    PDP_INTERROGATE_CALLBACK: () => process.env["PDP_INTERROGATE_CALLBACK"] ?? "",
    HAS_ROLE: () => !!process.env["PDP_HOST"] && !!process.env["PDP_ROLE_ENDPOINT"] && !!process.env["PDP_INTERROGATE_CALLBACK"]
}