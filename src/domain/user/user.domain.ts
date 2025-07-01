import { Token } from "../token/token.domain";

export class User {

    constructor(
        public username: string,
        public password: string,
        public token: Token | null,
    ) { 

    }

    public updateRefreshToken = (newToken: string) => {
        this.token = new Token(this.username, newToken);
    }
    
}