import { Container } from "inversify";

const TYPES = {
    roleService: Symbol.for("IRoleService"),
    databaseConnector: Symbol.for("databaseConnector")
}

export { TYPES };