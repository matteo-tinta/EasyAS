import { injectable } from "inversify";
import { ENVIRONMENT } from "../../environment";

type InternalizeRoleResponseDTO = {
    userId: string,
    roles: Array<{
        name: string,
        actions: Array<string>
    }>
}

export interface IRoleService {
    getRolesForUser: (userId: string) => Promise<Array<any>>;
}

@injectable()
export class NoRoleService implements IRoleService {
    public getRolesForUser = async (userId: string) => [];
}

@injectable()
export class RoleService implements IRoleService {

    public getRolesForUser = async (userId: string) => {
        const internalizeReponse = await fetch(`${ENVIRONMENT.PDP_HOST}${ENVIRONMENT.PDP_ROLE_ENDPOINT}?interrogate=${ENVIRONMENT.PDP_INTERROGATE_CALLBACK}`, {
            headers: {
                "x_roles_user_id": userId
            }
        })

        if(internalizeReponse.status == 404) {
            return []
        }

        if(!internalizeReponse.ok) {
            console.dir({
                error: "Internalize Error 0001: Response Status",
                response: internalizeReponse
            })
            throw new Error("Unable to call Internalize")
        }

        const response = await internalizeReponse.json()

        if(!("userId" in response) || typeof response.userId != "string" || response.userId != userId) {
            console.dir({
                error: "Internalize Error 0002: Reponse was unacceptable",
                userId: userId,
                response
            });

            throw new Error("Internalize Error 0002: Reponse was unacceptable")
        }

        const internalizeResponse: InternalizeRoleResponseDTO = response as InternalizeRoleResponseDTO;

        return internalizeResponse.roles;
    }
}